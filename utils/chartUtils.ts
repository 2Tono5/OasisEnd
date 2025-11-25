
import type { EnvironmentalReading, CombinedReading } from '../types/index';

export const processReadingsForChart = (readings: EnvironmentalReading[]): CombinedReading[] => {
  const groupedByTimestamp: { [key: string]: Partial<CombinedReading> } = {};

  readings.forEach(reading => {
    const d = new Date(reading.created_at);
    // Agrupar por minuto para evitar demasiados puntos en el gráfico
    const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
    
    if (!groupedByTimestamp[timestamp]) {
      groupedByTimestamp[timestamp] = {
        timestamp: timestamp,
        time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };
    }
    
    if (reading.sensor_type === 'temperature') {
      groupedByTimestamp[timestamp].temperature = reading.value;
    } else if (reading.sensor_type === 'humidity') {
      groupedByTimestamp[timestamp].humidity = reading.value;
    }
  });

  return Object.values(groupedByTimestamp)
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()) as CombinedReading[];
};
