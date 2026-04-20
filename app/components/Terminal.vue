<script setup lang="ts">
import { WTerm } from "@wterm/dom";
import type { Term } from "~/utils/term";

const props = defineProps<{
  term: Term | null;
}>();

const termRef = useTemplateRef<HTMLElement>("terminal");
const terminal = shallowRef<WTerm | null>(null);
const current = shallowRef<Term | null>(null);
let disposeTermData: (() => void) | null = null;
let disposeTermExit: (() => void) | null = null;

function detachTermListeners() {
  disposeTermData?.();
  disposeTermExit?.();
  disposeTermData = null;
  disposeTermExit = null;
}

function bindTerm(target: Term | null) {
  detachTermListeners();
  current.value = target;
  if (!target) {
    return;
  }

  disposeTermData = target.onData((data) => terminal.value?.write(data));
  disposeTermExit = target.onExit((code) => {
    terminal.value?.write(
      `\r\n\x1b[90m[shell exited${code === null ? "" : `: ${code}`}]\x1b[0m\r\n`,
    );
  });
}

onMounted(async () => {
  if (!termRef.value) {
    return;
  }

  const instance = new WTerm(termRef.value, {
    autoResize: true,
    onData: (data) => {
      void current.value?.send(data);
    },
  });
  await instance.init();
  terminal.value = instance;
  bindTerm(props.term);
});

watch(
  () => props.term,
  (next) => {
    bindTerm(next);
  },
);

onBeforeUnmount(() => {
  detachTermListeners();
  current.value = null;
  terminal.value?.destroy();
  terminal.value = null;
});
</script>

<template>
  <div ref="terminal" class="h-full w-full"></div>
</template>

<style>
.wterm {
  height: 100%;
}
</style>
