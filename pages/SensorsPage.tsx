
import React, { useState } from 'react';
import type { Sensor, System } from '../types/index';

interface SensorsPageProps {
  sensors: Sensor[];
  selectedSystem: System | null;
  onCreateSensor: (sensorData: Omit<Sensor, 'created_at'>) => Promise<void>;
  onDeleteSensor: (sensorId: number) => Promise<void>;
}

const SensorsPage: React.FC<SensorsPageProps> = ({ sensors, selectedSystem, onCreateSensor, onDeleteSensor }) => {
  const [newSensor, setNewSensor] = useState({ id: '', name: '', location: '', frequency: '60' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSensor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSystem || !newSensor.id || !newSensor.name || !newSensor.location) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await onCreateSensor({
        id: parseInt(newSensor.id, 10),
        name: newSensor.name,
        location: newSensor.location,
        system_id: selectedSystem.id,
        update_frequency: parseInt(newSensor.frequency, 10)
      });
      setSuccess('¡Sensor registrado con éxito!');
      setNewSensor({ id: '', name: '', location: '', frequency: '60' });
      setTimeout(() => setSuccess(null), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el sensor.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSystem) return <div>Selecciona un sistema</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Registrar Nuevo Sensor</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 border dark:border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ID Hardware</label>
            <input name="id" type="number" value={newSensor.id} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md p-2 dark:text-white" placeholder="Ej: 101" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
            <input name="name" type="text" value={newSensor.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md p-2 dark:text-white" placeholder="Sensor A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ubicación</label>
            <input name="location" type="text" value={newSensor.location} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md p-2 dark:text-white" placeholder="Zona Sur" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Frecuencia de Lectura</label>
            <select name="frequency" value={newSensor.frequency} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md p-2 dark:text-white">
                <option value="15">Cada 15 min</option>
                <option value="30">Cada 30 min</option>
                <option value="60">Cada 1 hora</option>
                <option value="120">Cada 2 horas</option>
            </select>
          </div>
          <div className="self-end">
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">
              {loading ? '...' : 'Registrar'}
            </button>
          </div>
        </form>
        {success && <p className="text-emerald-500 mt-2">{success}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Lista de Sensores</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 border dark:border-slate-800">
            <ul>
                {sensors.map(s => (
                    <li key={s.id} className="border-b py-2 flex justify-between dark:text-white">
                        <span>{s.name} ({s.location}) - ID: {s.id}</span>
                        <button onClick={() => onDeleteSensor(s.id)} className="text-red-500"><i className="fas fa-trash"></i></button>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default SensorsPage;
