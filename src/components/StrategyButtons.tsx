import React from 'react';
import { MemoryAllocationStrategy } from '../types';

interface StrategyButtonsProps {
  strategy: MemoryAllocationStrategy | null;
  onChangeStrategy: (strategy: MemoryAllocationStrategy) => void;
  onResetMemory: () => void;
}

const StrategyButtons: React.FC<StrategyButtonsProps> = ({ strategy, onChangeStrategy, onResetMemory }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => onChangeStrategy('firstFit')}
        disabled={strategy !== null}
        className={`px-4 py-2 rounded ${
          strategy === 'firstFit'
            ? 'bg-blue-500 text-white'
            : strategy === null
            ? 'bg-blue-200 hover:bg-blue-300'
            : 'bg-gray-200'
        }`}
      >
        Primer Ajuste
      </button>
      <button
        onClick={() => onChangeStrategy('bestFit')}
        disabled={strategy !== null}
        className={`px-4 py-2 rounded ${
          strategy === 'bestFit'
            ? 'bg-green-500 text-white'
            : strategy === null
            ? 'bg-green-200 hover:bg-green-300'
            : 'bg-gray-200'
        }`}
      >
        Mejor Ajuste
      </button>
      <button
        onClick={() => onChangeStrategy('worstFit')}
        disabled={strategy !== null}
        className={`px-4 py-2 rounded ${
          strategy === 'worstFit'
            ? 'bg-red-500 text-white'
            : strategy === null
            ? 'bg-red-200 hover:bg-red-300'
            : 'bg-gray-200'
        }`}
      >
        Peor Ajuste
      </button>
      <button
        onClick={onResetMemory}
        disabled={strategy === null}
        className={`px-4 py-2 rounded ${
          strategy !== null
            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
            : 'bg-gray-200'
        }`}
      >
        Cambiar Ajuste
      </button>
    </div>
  );
};

export default StrategyButtons;