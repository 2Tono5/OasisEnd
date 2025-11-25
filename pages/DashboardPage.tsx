
import React, { useState, useEffect } from 'react';
import type { System, Sensor, EnvironmentalReading, WateringSchedule, CombinedReading } from '../types/index';
import DataCard from '../components/DataCard';
import HistoryChart from '../components/HistoryChart';
import ScheduleManager from '../components/ScheduleManager';
import HistoryLog from '../components/HistoryLog';
import PlantStatus from '../components/PlantStatus';
import { OPTIMAL_TEMPERATURE_RANGE, OPTIMAL_HUMIDITY_RANGE } from '../constants/index';

interface DashboardPageProps {
  systems: System[];
  selectedSystem: System | null;
  onSystemChange: (systemId: string) => void;
  sensors: Sensor[];
  selectedSensorId: string;
  onSensorChange: (sensorId: string) => void;
  latestReadings: { [key: string]: EnvironmentalReading };
  chartData: CombinedReading[];
  historicalReadings: EnvironmentalReading[];
  wateringSchedule: WateringSchedule | null;
  onNavigateToSchedule: () => void;
  onNavigateToSensors: () => void;
  onCreateSystem: (name: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  systems,
  selectedSystem,
  onSystemChange,
  sensors,
  selectedSensorId,
  onSensorChange,
  latestReadings,
  chartData,
  historicalReadings,
  wateringSchedule,
  onNavigateToSchedule,
  onNavigateToSensors,
  onCreateSystem,
}) => {
  const [isCreatingSystem, setIsCreatingSystem] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');

  // Lógica de Notificaciones (RF2)
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!wateringSchedule || !wateringSchedule.is_active) return;
    
    const checkWatering = () => {
        const next = new Date(wateringSchedule.next_watering_time).getTime();
        const now = new Date().getTime();
        // Si faltan menos de 1 hora (3600000 ms) o ya pasó
        if (next - now < 3600000 && Notification.permission === "granted") {
            new Notification("¡Es hora de regar!", {
                body: "Tus orquídeas necesitan agua según el calendario.",
                icon: "/icon.png" // Opcional
            });
        }
    };
    
    // Chequear cada minuto
    const interval = setInterval(checkWatering, 60000);
    checkWatering(); // Chequear al montar

    return () => clearInterval(interval);
  }, [wateringSchedule]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSystemName.trim()) {
      onCreateSystem(newSystemName.trim());
      setIsCreatingSystem(false);
      setNewSystemName('');
    }
  };

  if (systems.length > 0 && !selectedSystem) {
    return (
       <div className="flex justify-center items-center h-96">
          <i className="fas fa-spinner fa-spin fa-3x text-emerald-500 dark:text-violet-400"></i>
        </div>
    );
  }
  
  if (systems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 transition-colors">
            <i className="fas fa-plus-circle fa-3x mb-4 text-emerald-500 dark:text-violet-400"></i>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">No Tienes Sistemas</h2>
            
            {!isCreatingSystem ? (
              <button 
                  onClick={() => setIsCreatingSystem(true)}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                  Crear mi primer sistema
              </button>
            ) : (
              <form onSubmit={handleCreateSubmit} className="mt-4 w-full max-w-sm flex flex-col items-center gap-3">
                <input
                  type="text"
                  value={newSystemName}
                  onChange={(e) => setNewSystemName(e.target.value)}
                  placeholder="Nombre de tu invernadero"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-md py-2 px-3 dark:text-white"
                  autoFocus
                />
                <div className="flex gap-3">
                   <button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">Crear</button>
                   <button type="button" onClick={() => setIsCreatingSystem(false)} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                </div>
              </form>
            )}
        </div>
      );
  }
  
  const tempReading = latestReadings['temperature']?.value;
  const humidityReading = latestReadings['humidity']?.value;
  const hasSensors = sensors.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border dark:border-slate-800 transition-colors">
        <div className="flex items-center w-full sm:w-auto">
          <label className="text-lg font-semibold text-slate-700 dark:text-slate-300 mr-4">Sistema:</label>
          <select
            value={selectedSystem?.id || ''}
            onChange={(e) => onSystemChange(e.target.value)}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white"
          >
            {systems.map(system => <option key={system.id} value={system.id}>{system.name}</option>)}
          </select>
        </div>
        
        {hasSensors && (
          <div className="flex items-center w-full sm:w-auto">
            <label className="text-lg font-semibold text-slate-700 dark:text-slate-300 mr-4">Sensor:</label>
            <select
              value={selectedSensorId}
              onChange={(e) => onSensorChange(e.target.value)}
              className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white"
            >
              <option value="all">Todos los sensores</option>
              {sensors.map(sensor => <option key={sensor.id} value={sensor.id}>{sensor.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {!hasSensors && selectedSystem ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 text-center text-slate-600 dark:text-slate-300 mt-6 border dark:border-slate-800">
          <i className="fas fa-satellite-dish fa-3x mb-4 text-amber-500"></i>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No hay sensores</h3>
          <p className="mt-2">Registra un sensor para ver datos.</p>
           <button onClick={onNavigateToSensors} className="mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">
              Registrar Sensor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataCard icon="fa-thermometer-half" title="Temperatura" value={tempReading} unit="°C" optimalRange={OPTIMAL_TEMPERATURE_RANGE} />
              <DataCard icon="fa-tint" title="Humedad" value={humidityReading} unit="%" optimalRange={OPTIMAL_HUMIDITY_RANGE} />
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-4 sm:p-6 border dark:border-slate-800">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Historial (24h)</h2>
              <div className="h-80"><HistoryChart data={chartData} /></div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <PlantStatus temperature={tempReading} humidity={humidityReading} />
            <ScheduleManager schedule={wateringSchedule} onNavigateToSchedule={onNavigateToSchedule} />
            <HistoryLog readings={historicalReadings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
