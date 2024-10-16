import React from 'react';
import { Program } from '../types';

interface ProgramListProps {
  programs: Program[];
  onAddProgram: (program: Program) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, onAddProgram }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {programs.map((program) => (
        <div key={program.id} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">{program.id}</h3>
          <p>Texto: {program.text} bytes</p>
          <p>Datos: {program.data} bytes</p>
          <p>BSS: {program.bss} bytes</p>
          <p>Pila: {program.stack} bytes</p>
          <p>Montículo: {program.heap} bytes</p>
          {program.id !== 'OS' && (
            <button
              onClick={() => onAddProgram(program)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir a Memoria
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgramList;