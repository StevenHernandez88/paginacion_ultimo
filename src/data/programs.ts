import { Program } from '../types';

export const programs: Program[] = [
  { id: 'OS', text: 524288, data: 262144, bss: 131072, stack: 65536, heap: 65536 }, // 1 MiB total
  { id: 'P1', text: 19524, data: 12352, bss: 1165, stack: 65536, heap: 131072 },
  { id: 'P2', text: 77539, data: 32680, bss: 4100, stack: 65536, heap: 131072 },
  { id: 'P3', text: 99542, data: 24245, bss: 7557, stack: 65536, heap: 131072 },
  { id: 'P4', text: 115000, data: 123470, bss: 1123, stack: 65536, heap: 131072 },
  { id: 'P5', text: 12342, data: 1256, bss: 1756, stack: 65536, heap: 131072 },
  { id: 'P6', text: 525000, data: 3224000, bss: 51000, stack: 65536, heap: 131072 },
  { id: 'P7', text: 590000, data: 974000, bss: 25000, stack: 65536, heap: 131072 },
  { id: 'P8', text: 349000, data: 2150000, bss: 1000, stack: 65536, heap: 131072 },
];