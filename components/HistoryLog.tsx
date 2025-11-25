
import React from 'react';
import type { EnvironmentalReading } from '../types/index';

interface HistoryLogProps {
  readings: EnvironmentalReading[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ readings }) => {
  const sortedReadings = React.useMemo(() => 
    [...readings].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ), [readings]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 transition-colors">Registro Histórico Detallado</h2>
      <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {sortedReadings.length === 0 ? (
          <p className="text-center py-4 text-slate-500 dark:text-slate-400">No hay datos históricos disponibles.</p>
        ) : (
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 sticky top-0 transition-colors">
              <tr>
                <th scope="col" className="px-4 py-3">Hora</th>
                <th scope="col" className="px-4 py-3">Tipo</th>
                <th scope="col" className="px-4 py-3 text-center">Valor</th>
              </tr>
            </thead>
            <tbody>
              {sortedReadings.map((reading) => {
                const readingDate = new Date(reading.created_at);
                const isTemp = reading.sensor_type === 'temperature';
                // Use Amber for temp, Sky for humidity in both modes, but adjust shades if needed
                const valueColor = isTemp ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400';
                const unit = isTemp ? '°C' : '%';

                return (
                  <tr key={reading.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-2">{readingDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-2 capitalize">{reading.sensor_type}</td>
                    <td className={`px-4 py-2 text-center font-medium ${valueColor}`}>
                        {reading.value.toFixed(1)} {unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default React.memo(HistoryLog);
