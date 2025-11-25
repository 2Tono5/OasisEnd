import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { System, Sensor, EnvironmentalReading, WateringSchedule, CombinedReading } from '../types/index';
import { processReadingsForChart } from '../utils/chartUtils';
import { useAuth } from '../contexts/AuthContext';

export const useSystemData = () => {
  const { session } = useAuth();
  
  // Estados
  const [systems, setSystems] = useState<System[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string | number>('all');
  
  const [latestReadings, setLatestReadings] = useState<{ [key: string]: EnvironmentalReading }>({});
  const [historicalReadings, setHistoricalReadings] = useState<EnvironmentalReading[]>([]);
  const [chartData, setChartData] = useState<CombinedReading[]>([]);
  const [wateringSchedule, setWateringSchedule] = useState<WateringSchedule | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sistemas del usuario
  useEffect(() => {
    const fetchSystems = async () => {
      if (session?.user) {
        setLoading(true);
        try {
          const userSystems = await apiService.getSystems(session.user.id);
          setSystems(userSystems);
          if (userSystems.length > 0) {
            setSelectedSystem(userSystems[0]);
          } else {
            setSelectedSystem(null);
            setLoading(false);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar sistemas');
          setLoading(false);
        }
      } else if (!session) {
        setLoading(false);
      }
    };
    fetchSystems();
  }, [session]);

  const fetchDataForSystem = useCallback(async (systemId: string, sensorId: string | number) => {
    setLoading(true);
    setError(null);
    try {
      // Nota: Si no hay sensores, latestReadings estará vacío, manejar eso en UI
      const readings = await apiService.getReadings(systemId);
      
      // Filtrar por sensor si es necesario
      let filteredReadings = readings;
      if (sensorId !== 'all') {
          filteredReadings = readings.filter(r => String(r.sensor_id) === String(sensorId));
      }

      setHistoricalReadings(filteredReadings);
      setChartData(processReadingsForChart(filteredReadings));

      // Obtener últimas lecturas
      const latest: { [key: string]: EnvironmentalReading } = {};
      // Temperatura
      const lastTemp = filteredReadings.find(r => r.sensor_type === 'temperature');
      if (lastTemp) latest['temperature'] = lastTemp;
      // Humedad
      const lastHum = filteredReadings.find(r => r.sensor_type === 'humidity');
      if (lastHum) latest['humidity'] = lastHum;
      
      setLatestReadings(latest);

      const schedule = await apiService.getSchedule(systemId);
      setWateringSchedule(schedule);

    } catch (err) {
      console.error(err);
      setError('Error obteniendo datos del sistema');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar detalles cuando cambia el sistema
  useEffect(() => {
    if (selectedSystem) {
      const fetchDetails = async () => {
        setLoading(true);
        setSelectedSensorId('all');
        try {
          const systemSensors = await apiService.getSensors(selectedSystem.id);
          setSensors(systemSensors);
          await fetchDataForSystem(selectedSystem.id, 'all');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar detalles del sistema.');
          setLoading(false);
        }
      };
      fetchDetails();
    } else if (session) {
      setLoading(false);
      setSensors([]);
      setLatestReadings({});
      setHistoricalReadings([]);
      setChartData([]);
      setWateringSchedule(null);
    }
  }, [selectedSystem, session, fetchDataForSystem]);

  // Handlers
  const handleSystemChange = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system) setSelectedSystem(system);
  };

  const handleSensorChange = (sensorId: string) => {
    const id = sensorId === 'all' ? 'all' : sensorId;
    setSelectedSensorId(id);
    if (selectedSystem) fetchDataForSystem(selectedSystem.id, id);
  };

  const handleCreateSystem = async (systemName: string) => {
    if (!session?.user || !systemName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const newSystem = await apiService.createSystem(session.user.id, systemName.trim());
      setSystems(prev => [...prev, newSystem]);
      setSelectedSystem(newSystem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el sistema.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateSensor = async (sensorData: Omit<Sensor, 'created_at'>) => {
    const newSensor = await apiService.createSensor(sensorData);
    setSensors(prev => [...prev, newSensor].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleDeleteSensor = async (sensorId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este sensor?')) {
        // Nota: Asumimos que la API tiene delete, por ahora simulamos UI
        setSensors(prev => prev.filter(s => s.id !== sensorId));
    }
  };

  const retryFetch = () => {
    if (selectedSystem) {
        fetchDataForSystem(selectedSystem.id, selectedSensorId);
    }
  };

  return {
    loading,
    error,
    systems,
    selectedSystem,
    sensors,
    selectedSensorId,
    latestReadings,
    chartData,
    historicalReadings,
    wateringSchedule,
    handleSystemChange,
    handleSensorChange,
    handleCreateSystem,
    handleCreateSensor,
    handleDeleteSensor,
    retryFetch,
    setWateringSchedule,
  };
};