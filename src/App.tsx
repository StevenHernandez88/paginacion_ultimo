import React, { useState, useEffect } from 'react';
import { Program, Process, MemoryFrame, MemoryAllocationStrategy } from './types';
import { programs } from './data/programs';
import MemoryTable from './components/MemoryTable';
import ProcessTable from './components/ProcessTable';
import MemoryVisualization from './components/MemoryVisualization';
import ProgramList from './components/ProgramList';
import StrategyButtons from './components/StrategyButtons';

const FRAME_SIZES = [6, 7, 8, 9, 10]; // 64, 128, 256, 512, 1024 frames

function App() {
  const [frameSize, setFrameSize] = useState(FRAME_SIZES[2]); // Default to 8 (256 frames)
  const [processes, setProcesses] = useState<Process[]>([]);
  const [frames, setFrames] = useState<MemoryFrame[]>([]);
  const [strategy, setStrategy] = useState<MemoryAllocationStrategy | null>(null);
  const totalMemory = 16 * 1024 * 1024; // 16 MiB
  const totalFrames = Math.pow(2, frameSize);
  const frameSizeBytes = totalMemory / totalFrames;

  useEffect(() => {
    initializeMemory();
  }, [frameSize]);

  const initializeMemory = () => {
    const osFrames = Math.ceil((1 * 1024 * 1024) / frameSizeBytes); // 1 MiB for OS
    const newFrames: MemoryFrame[] = Array.from({ length: totalFrames }, (_, i) => ({
      id: i,
      processId: i < osFrames ? 'OS' : null,
    }));
    setFrames(newFrames);
    
    const osProcess: Process = {
      id: 'OS',
      name: 'Sistema Operativo',
      size: 1 * 1024 * 1024,
      text: 524288,
      data: 262144,
      bss: 131072,
      stack: 65536,
      heap: 65536,
      pages: Array.from({ length: osFrames }, (_, i) => ({ id: i, frame: i }))
    };
    setProcesses([osProcess]);
  };

  const generatePID = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const addProcess = (program: Program) => {
    if (!strategy) {
      alert("Por favor, seleccione una estrategia de asignación de memoria primero.");
      return;
    }

    const pid = generatePID();
    const newProcess: Process = {
      id: pid,
      name: program.id,
      size: program.text + program.data + program.bss + program.stack + program.heap,
      text: program.text,
      data: program.data,
      bss: program.bss,
      stack: program.stack,
      heap: program.heap,
      pages: [],
    };

    const requiredFrames = Math.ceil(newProcess.size / frameSizeBytes);
    let allocatedFrames: number[] = [];

    switch (strategy) {
      case 'firstFit':
        allocatedFrames = firstFitAllocation(requiredFrames);
        break;
      case 'bestFit':
        allocatedFrames = bestFitAllocation(requiredFrames);
        break;
      case 'worstFit':
        allocatedFrames = worstFitAllocation(requiredFrames);
        break;
    }

    if (allocatedFrames.length < requiredFrames) {
      alert("No hay suficiente memoria disponible para este proceso.");
      return;
    }

    const updatedFrames = [...frames];
    newProcess.pages = allocatedFrames.map((frameId, index) => {
      updatedFrames[frameId].processId = pid;
      return { id: index, frame: frameId };
    });

    setFrames(updatedFrames);
    setProcesses([...processes, newProcess]);
  };

  const firstFitAllocation = (requiredFrames: number): number[] => {
    const allocatedFrames: number[] = [];
    let consecutiveFrames = 0;
    let startFrame = -1;

    for (let i = 0; i < frames.length; i++) {
      if (frames[i].processId === null) {
        if (startFrame === -1) startFrame = i;
        consecutiveFrames++;

        if (consecutiveFrames === requiredFrames) {
          for (let j = 0; j < requiredFrames; j++) {
            allocatedFrames.push(startFrame + j);
          }
          break;
        }
      } else {
        consecutiveFrames = 0;
        startFrame = -1;
      }
    }

    return allocatedFrames;
  };

  const bestFitAllocation = (requiredFrames: number): number[] => {
    let bestFitStart = -1;
    let bestFitSize = Infinity;
    let currentStart = -1;
    let currentSize = 0;

    for (let i = 0; i <= frames.length; i++) {
      if (i < frames.length && frames[i].processId === null) {
        if (currentStart === -1) currentStart = i;
        currentSize++;
      } else {
        if (currentSize >= requiredFrames && currentSize < bestFitSize) {
          bestFitStart = currentStart;
          bestFitSize = currentSize;
        }
        currentStart = -1;
        currentSize = 0;
      }
    }

    if (bestFitStart !== -1) {
      return Array.from({ length: requiredFrames }, (_, i) => bestFitStart + i);
    }

    return [];
  };

  const worstFitAllocation = (requiredFrames: number): number[] => {
    let worstFitStart = -1;
    let worstFitSize = 0;
    let currentStart = -1;
    let currentSize = 0;

    for (let i = 0; i <= frames.length; i++) {
      if (i < frames.length && frames[i].processId === null) {
        if (currentStart === -1) currentStart = i;
        currentSize++;
      } else {
        if (currentSize > worstFitSize) {
          worstFitStart = currentStart;
          worstFitSize = currentSize;
        }
        currentStart = -1;
        currentSize = 0;
      }
    }

    if (worstFitStart !== -1 && worstFitSize >= requiredFrames) {
      return Array.from({ length: requiredFrames }, (_, i) => worstFitStart + i);
    }

    return [];
  };

  const removeProcess = (processId: string) => {
    const updatedFrames = frames.map(frame => 
      frame.processId === processId ? { ...frame, processId: null } : frame
    );
    setFrames(updatedFrames);
    setProcesses(processes.filter(process => process.id !== processId));
  };

  const handleChangeStrategy = (newStrategy: MemoryAllocationStrategy) => {
    setStrategy(newStrategy);
  };

  const handleResetMemory = () => {
    setStrategy(null);
    initializeMemory();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Simulación de Paginación de Memoria</h1>
      
      <div className="mb-4">
        <label htmlFor="frameSize" className="mr-2">Tamaño de marco (bits):</label>
        <select
          id="frameSize"
          value={frameSize}
          onChange={(e) => setFrameSize(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {FRAME_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} bits ({Math.pow(2, size)} marcos)
            </option>
          ))}
        </select>
      </div>

      <StrategyButtons
        strategy={strategy}
        onChangeStrategy={handleChangeStrategy}
        onResetMemory={handleResetMemory}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Programas Disponibles</h2>
          <ProgramList programs={programs} onAddProgram={addProcess} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tabla de Marcos de Memoria</h2>
          <MemoryTable frames={frames} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Tablas de Procesos</h2>
          {processes.map((process) => (
            <ProcessTable 
              key={process.id} 
              process={process} 
              frameSize={frameSizeBytes} 
              frames={frames} 
              onRemove={process.id !== 'OS' ? removeProcess : undefined}
            />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Visualización de Memoria</h2>
          <MemoryVisualization frames={frames} totalFrames={totalFrames} processes={processes} />
        </div>
      </div>
    </div>
  );
}

export default App;