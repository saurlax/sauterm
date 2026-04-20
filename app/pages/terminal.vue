<script setup lang="ts">
import { WTerm } from "@wterm/dom";

definePageMeta({
  key: (route) => route.fullPath,
  keepalive: true,
});

const route = useRoute();
const tabs = useState<Tab[]>("tabs", () => []);
const terminalRef = useTemplateRef<HTMLElement>("terminal");
const terminal = shallowRef<WTerm | null>(null);
const currentProcess = shallowRef<ProcessHandle | null>(null);

const termId = computed(() => {
  const value = route.query.termId;
  return typeof value === "string" ? value : null;
});

const process = computed(() => {
  if (!termId.value) {
    return null;
  }

  return (
    tabs.value.find((tab) => tab.type === "terminal" && tab.id === termId.value)
      ?.process ?? null
  );
});

let disposeProcessData: (() => void) | null = null;
let disposeProcessExit: (() => void) | null = null;

function detachProcessListeners() {
  disposeProcessData?.();
  disposeProcessExit?.();
  disposeProcessData = null;
  disposeProcessExit = null;
}

function bindProcess(target: ProcessHandle | null) {
  detachProcessListeners();
  currentProcess.value = target;
  if (!target) {
    return;
  }

  disposeProcessData = target.onData((data) => terminal.value?.write(data));
  disposeProcessExit = target.onExit((code) => {
    terminal.value?.write(
      `\r\n\x1b[90m[shell exited${code === null ? "" : `: ${code}`}]\x1b[0m\r\n`,
    );
  });
}

onMounted(async () => {
  if (!terminalRef.value) {
    return;
  }

  const instance = new WTerm(terminalRef.value, {
    autoResize: true,
    onData: (data) => {
      void currentProcess.value?.send(data);
    },
  });

  await instance.init();
  terminal.value = instance;
  bindProcess(process.value);
});

watch(
  process,
  (next) => {
    bindProcess(next);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  detachProcessListeners();
  currentProcess.value = null;
  terminal.value?.destroy();
  terminal.value = null;
});
</script>

<template>
  <div ref="terminal" />
</template>

<style>
@import "@wterm/dom/css";

.wterm {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
}
</style>
