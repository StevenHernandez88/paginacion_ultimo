export interface Program {
  id: string;
  text: number;
  data: number;
  bss: number;
  stack: number;
  heap: number;
}

export interface Page {
  id: number;
  frame: number;
}

export interface Process {
  id: string;
  name: string;
  size: number;
  text: number;
  data: number;
  bss: number;
  stack: number;
  heap: number;
  pages: Page[];
}

export interface MemoryFrame {
  id: number;
  processId: string | null;
}

export type MemoryAllocationStrategy = 'firstFit' | 'bestFit' | 'worstFit';