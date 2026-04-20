interface ProcessHandle {
  termId: string;
  command?: string;
  args?: string[];
  open(): Promise<void>;
  send(data: string): Promise<void>;
  onData(handler: (data: string) => void): () => void;
  onExit(handler: (code: number | null) => void): () => void;
  close(): Promise<void>;
  dispose(): Promise<void>;
}

interface Tab {
  id: string;
  title: string;
  type: "terminal" | "page";
  to: string;
  process?: ProcessHandle;
}

interface TerminalTab extends Tab {
  type: "terminal";
  process: ProcessHandle;
}
