import React from 'react';
import { MemoryFrame, Process } from '../types';

interface MemoryVisualizationProps {
  frames: MemoryFrame[];
  totalFrames: number;
  processes: Process[];
}

const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({ frames, totalFrames, processes }) => {
  const getColor = (processId: string | null) => {
    if (processId === 'OS') return 'bg-gray-500';
    if (processId === null) return 'bg-gray-200';
    return `bg-${['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo', 'teal'][parseInt(processId) % 8]}-500`;
  };

  const getProcessInfo = (processId: string | null) => {
    if (!processId) return 'Libre';
    const process = processes.find(p => p.id === processId);
    return process ? `${process.name} (PID: ${process.id})` : 'Desconocido';
  };

  const getSegmentType = (processId: string | null, frameIndex: number) => {
    if (!processId) return '';
    const process = processes.find(p => p.id === processId);
    if (!process) return '';
    const pageIndex = process.pages.findIndex(p => p.frame === frameIndex);
    if (pageIndex === -1) return '';
    
    const totalPages = process.pages.length;
    if (pageIndex < totalPages * 0.2) return 'stack';
    if (pageIndex < totalPages * 0.4) return 'txt';
    if (pageIndex < totalPages * 0.6) return 'data';
    if (pageIndex < totalPages * 0.8) return 'bss';
    return 'heap';
  };

  return (
    <div className="w-full h-[2400px] border border-gray-300 flex flex-col">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className={`flex-grow ${getColor(frame.processId)} border-t border-gray-400 relative`}
          style={{ flexBasis: `${100 / totalFrames}%` }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
            <span className="bg-black bg-opacity-50 p-1 rounded">
              {getProcessInfo(frame.processId)} - {getSegmentType(frame.processId, frame.id)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoryVisualization;