
import React from 'react';
import type { WateringSchedule } from '../types/index';

interface ScheduleManagerProps {
  schedule: WateringSchedule | null;
  onNavigateToSchedule: () => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ schedule, onNavigateToSchedule }) => {
  const nextWateringDate = schedule ? new Date(schedule.next_watering_time) : null;
  const formattedNextWatering = nextWateringDate 
    ? nextWateringDate.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short'})
    : 'No establecido';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 space-y-4 border dark:border-slate-800 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 transition-colors">Calendario de Riego</h2>
        <button 
          onClick={onNavigateToSchedule}
          className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors flex items-center"
          aria-label={'Gestionar calendario de riego'}
        >
          <i className="fas fa-edit mr-2" aria-hidden="true"></i>
          Gestionar
        </button>
      </div>
      
      {schedule ? (
           <div className="space-y-3">
            <InfoRow icon="fa-clock" label="Próximo Riego" value={formattedNextWatering} />
            <InfoRow icon="fa-calendar-alt" label="Frecuencia" value={`Cada ${schedule.frequency_days} día(s)`} />
          </div>
      ) : (
           <div className="text-slate-500 dark:text-slate-400 text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg transition-colors">
              No hay un calendario de riego activo para este sistema.
          </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{icon: string, label: string, value: string}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="bg-emerald-100 dark:bg-violet-900/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
      <i className={`fas ${icon} text-2xl text-emerald-600 dark:text-violet-400`} aria-hidden="true"></i>
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{label}</p>
      <p className="text-slate-900 dark:text-slate-200 font-semibold transition-colors">{value}</p>
    </div>
  </div>
);

export default ScheduleManager;
