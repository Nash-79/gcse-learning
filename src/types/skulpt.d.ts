interface SkulptBuiltinFiles {
  files: Record<string, string>;
}

interface SkulptConfig {
  output: (text: string) => void;
  read: (x: string) => string;
}

interface SkulptMisceval {
  asyncToPromise: (fn: () => unknown) => Promise<unknown>;
}

interface Skulpt {
  pre: string;
  builtinFiles: SkulptBuiltinFiles | undefined;
  configure: (config: SkulptConfig) => void;
  misceval: SkulptMisceval;
  importMainWithBody: (name: string, dumpJS: boolean, codestr: string, canSuspend: boolean) => unknown;
}

declare global {
  interface Window {
    Sk: Skulpt | undefined;
    hljs: {
      highlightAll: () => void;
      highlightElement: (el: Element) => void;
    } | undefined;
  }
}

export {};
