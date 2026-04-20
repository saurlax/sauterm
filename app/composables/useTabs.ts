import type { NavigationMenuItem } from "@nuxt/ui";
import { Process as ProcessClient } from "~/utils/process";

type TabItems = NavigationMenuItem[];
type ProcessOptions = ConstructorParameters<typeof ProcessClient>[0];

export default function useTabs() {
  const tabs = useState<Tab[]>("tabs", () => []);
  const activeTab = useState<string | undefined>(
    "active-process-tab",
    () => undefined,
  );

  const tabItems = computed<TabItems>(() =>
    tabs.value.map(({ id, title, to }) => ({
      label: title,
      value: id,
      to,
    })),
  );

  async function openTab(options: ProcessOptions & { title?: string } = {}) {
    const process = new ProcessClient({
      command: options.command ?? "cmd.exe",
      args: options.args,
    });
    await process.open();

    const tab: TerminalTab = {
      id: process.termId,
      title: options.title ?? "cmd",
      type: "terminal",
      to: `/terminal?termId=${process.termId}`,
      process,
    };

    tabs.value.push(tab);
    activeTab.value = process.termId;
    return process;
  }

  function openPageTab(to: string, title: string) {
    const tab: Tab = {
      id: crypto.randomUUID(),
      title,
      type: "page",
      to,
    };

    tabs.value.push(tab);
    activeTab.value = tab.id;
    return tab;
  }

  function openOrFocusPageTab(to: string, title: string) {
    const existing = tabs.value.find((item) => item.type === "page" && item.to === to);
    if (existing) {
      activeTab.value = existing.id;
      return existing;
    }

    return openPageTab(to, title);
  }

  function openSettingsTab() {
    return openOrFocusPageTab("/settings", "Settings");
  }

  async function closeTab(termId: string | undefined = activeTab.value) {
    if (!termId) {
      return;
    }

    const tab = tabs.value.find((item) => item.id === termId);
    if (tab?.type === "terminal" && tab.process) {
      await tab.process.close();
    }

    const index = tabs.value.findIndex((item) => item.id === termId);
    if (index === -1) {
      return;
    }

    tabs.value.splice(index, 1);

    if (activeTab.value === termId) {
      const next = tabs.value[index] ?? tabs.value[index - 1];
      activeTab.value = next?.id;
    }
  }

  return {
    tabs,
    tabItems,
    activeTab,
    openTab,
    openPageTab,
    openOrFocusPageTab,
    openSettingsTab,
    closeTab,
  };
}
