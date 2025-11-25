import React, { useState, useEffect } from 'react';
import type { WateringSchedule } from '../types/index';
import { apiService } from '../services/apiService';

interface SchedulePageProps {
  initialSchedule: WateringSchedule | null;
  systemId: string;
  onScheduleUpdate: (schedule: WateringSchedule) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ initialSchedule, systemId, onScheduleUpdate }) => {
  const [schedule, setSchedule] = useState<Partial<WateringSchedule>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialSchedule) {
      setSchedule({
        ...initialSchedule,
        next_watering_time: new Date(initialSchedule.next_watering_time).toISOString().slice(0, 16),
      });
    } else {
      setSchedule({
        next_watering_time: new Date().toISOString().slice(0, 16),
        frequency_days: 3,
        is_active: true,
        system_id: systemId,
      });
    }
  }, [initialSchedule, systemId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const scheduleToSave: any = {
        ...schedule,
        system_id: systemId,
        next_watering_time: new Date(schedule.next_watering_time!).toISOString(),
      };
      
      const updated = await apiService.saveSchedule(scheduleToSave);
      onScheduleUpdate(updated);
      setSuccess('¡Calendario guardado con éxito!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 sm:p-8 max-w-2xl mx-auto border dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Gestionar Calendario de Riego</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="next_watering_time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Próximo Riego
          </label>
          <input
            id="next_watering_time"
            name="next_watering_time"
            type="datetime-local"
            value={schedule.next_watering_time || ''}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-violet-500 focus:border-emerald-500 dark:focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label htmlFor="frequency_days" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Frecuencia (en días)
          </label>
          <input
            id="frequency_days"
            name="frequency_days"
            type="number"
            value={schedule.frequency_days || ''}
            onChange={handleChange}
            min="1"
            required
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-violet-500 focus:border-emerald-500 dark:focus:border-violet-500 transition"
          />
        </div>

        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={schedule.is_active ?? false}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-emerald-600 dark:text-violet-500 focus:ring-emerald-500 dark:focus:ring-violet-500"
          />
          <label htmlFor="is_active" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Calendario Activo
          </label>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-emerald-500 dark:text-violet-400 text-sm text-center">{success}</p>}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-emerald-500 dark:focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (initialSchedule ? 'Actualizar Calendario' : 'Crear Calendario')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchedulePage;