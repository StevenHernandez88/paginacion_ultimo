import React from 'react';
import { Process, MemoryFrame } from '../types';

interface ProcessTableProps {
  process: Process;
  frameSize: number;
  frames: MemoryFrame[];
  onRemove?: (processId: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ process, frameSize, frames, onRemove }) => {
  const getSegmentType = (pageId: number) => {
    const totalPages = process.pages.length;
    let accumulatedSize = 0;
    const sizes = [
      { type: 'stack', size: process.stack },
      { type: 'text', size: process.text },
      { type: 'data', size: process.data },
      { type: 'bss', size: process.bss },
      { type: 'heap', size: process.heap },
    ];

    for (const { type, size } of sizes) {
      accumulatedSize += size;
      if (pageId < (accumulatedSize / process.size) * totalPages) {
        return type;
      }
    }

    return 'unknown';
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Proceso: {process.name} (PID: {process.id})</h3>
        {onRemove && (
          <button
            onClick={() => onRemove(process.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar Proceso
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Página</th>
              <th className="px-4 py-2 border-b">Marco</th>
              <th className="px-4 py-2 border-b">Dirección Base</th>
              <th className="px-4 py-2 border-b">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {process.pages.map((page) => (
              <tr key={page.id}>
                <td className="px-4 py-2 border-b">{page.id}</td>
                <td className="px-4 py-2 border-b">{page.frame}</td>
                <td className="px-4 py-2 border-b">0x{(page.frame * frameSize).toString(16).padStart(8, '0')}</td>
                <td className="px-4 py-2 border-b">{getSegmentType(page.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessTable;