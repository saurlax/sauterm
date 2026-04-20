<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { tabItems, tabs, activeTab, openTab, openSettingsTab, closeTab } =
  useTabs();

const navigationItems = computed(() => [
  [
    ...tabItems.value,
    {
      icon: "i-lucide-plus",
      value: "__add",
      onSelect: (event: Event) => {
        event.preventDefault();
        void onAddTab();
      },
    },
  ],
  [
    {
      icon: "i-lucide-settings",
      value: "__settings",
      onSelect: (event: Event) => {
        event.preventDefault();
        onOpenSettings();
      },
    },
  ],
]);

watch(
  () => route.fullPath,
  (fullPath) => {
    activeTab.value = tabs.value.find((item) => item.to === fullPath)?.id;
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

function onOpenSettings() {
  const tab = openSettingsTab();
  void router.push(tab.to);
}

async function onCloseTab(tabId: string | undefined) {
  if (!tabId) {
    return;
  }
  await closeTab(tabId);
}

function isClosable(value: string | undefined) {
  if (!value) {
    return false;
  }
  return tabs.value.some((tab) => tab.id === value);
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <UNavigationMenu
      v-model="activeTab"
      :items="navigationItems"
      highlight
      variant="link"
    >
      <template #item-trailing="{ item }">
        <UButton
          v-if="isClosable(item.value)"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Close tab"
          @click.stop="onCloseTab(item.value)"
        />
      </template>
    </UNavigationMenu>
    <div class="min-h-0 flex-1">
      <slot />
    </div>
  </div>
</template>
