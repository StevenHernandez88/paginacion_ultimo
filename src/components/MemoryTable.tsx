import React from 'react';
import { MemoryFrame } from '../types';

interface MemoryTableProps {
  frames: MemoryFrame[];
}

const MemoryTable: React.FC<MemoryTableProps> = ({ frames }) => {
  return (
    <div className="overflow-y-auto max-h-[600px]">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="sticky top-0 bg-white">
          <tr>
            <th className="px-4 py-2 border-b">Marco</th>
            <th className="px-4 py-2 border-b">PID</th>
          </tr>
        </thead>
        <tbody>
          {frames.map((frame) => (
            <tr key={frame.id} className={frame.processId === 'OS' ? 'bg-gray-200' : ''}>
              <td className="px-4 py-2 border-b">{frame.id}</td>
              <td className="px-4 py-2 border-b">{frame.processId || 'Libre'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemoryTable;