declare global {
  interface Window {
    acquireVsCodeApi: () => unknown;
  }
}

export {};
