<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { tabItems, tabs, activeTab, openTab } = useTabs();

watch(
  () => route.fullPath,
  (fullPath) => {
    const tab = tabs.value.find((item) => item.to === fullPath);
    if (tab && activeTab.value !== tab.id) {
      activeTab.value = tab.id;
    }
  },
  { immediate: true },
);

watch(
  activeTab,
  (tabId) => {
    if (!tabId) {
      return;
    }

    const tab = tabs.value.find((item) => item.id === tabId);
    if (!tab || route.fullPath === tab.to) {
      return;
    }

    void router.push(tab.to);
  },
  { immediate: true },
);

async function onAddTab() {
  await openTab({ command: "cmd.exe", title: "cmd" });
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <div class="flex items-center gap-2 border-b border-default px-3 py-2">
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        variant="link"
        :content="false"
        class="min-w-0 flex-1"
      />
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        aria-label="New tab"
        @click="onAddTab"
      />
    </div>
    <div class="min-h-0 flex-1">
      <slot />
    </div>
  </div>
</template>
