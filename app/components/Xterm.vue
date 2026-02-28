<script setup lang="ts">
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import "@xterm/xterm/css/xterm.css";

const termRef = useTemplateRef("terminal");
const term = new Terminal({
  windowOptions: {},
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.loadAddon(new WebglAddon());

onMounted(() => {
  term.open(termRef.value!);
  fitAddon.fit();
  window.addEventListener("resize", () => fitAddon.fit());
  term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
});
</script>

<template>
  <div ref="terminal"></div>
</template>

<style scoped></style>
