
// Para ejecutar esta prueba, necesitarás Vitest o Jest.
// Ejemplo con Vitest: `npx vitest`

import { describe, it, expect } from 'vitest';
import { processReadingsForChart } from '../../utils/chartUtils';
import type { EnvironmentalReading } from '../../types/index';

describe('processReadingsForChart', () => {
  it('should group temperature and humidity readings by the same timestamp', () => {
    const readings: EnvironmentalReading[] = [
      { id: 1, sensor_id: 1, value: 22.5, created_at: '2023-10-27T10:00:00Z', sensor_type: 'temperature', sensor_name: 'S1' },
      { id: 2, sensor_id: 1, value: 80.1, created_at: '2023-10-27T10:00:00Z', sensor_type: 'humidity', sensor_name: 'S1' },
      { id: 3, sensor_id: 1, value: 23.0, created_at: '2023-10-27T10:05:00Z', sensor_type: 'temperature', sensor_name: 'S1' },
    ];

    const result = processReadingsForChart(readings);

    expect(result).toHaveLength(2);
    expect(result[0].temperature).toBe(22.5);
    expect(result[0].humidity).toBe(80.1);
    expect(result[1].temperature).toBe(23.0);
    expect(result[1].humidity).toBeUndefined();
  });

  it('should return an empty array if no readings are provided', () => {
    const readings: EnvironmentalReading[] = [];
    const result = processReadingsForChart(readings);
    expect(result).toEqual([]);
  });

  it('should correctly format the time string', () => {
    const readings: EnvironmentalReading[] = [
      { id: 1, sensor_id: 1, value: 22.5, created_at: '2023-10-27T18:30:00Z', sensor_type: 'temperature', sensor_name: 'S1' },
    ];
    const result = processReadingsForChart(readings);
    // El resultado exacto puede variar según la zona horaria del entorno de prueba,
    // pero debería tener el formato HH:MM.
    expect(result[0].time).toMatch(/\d{2}:\d{2}/);
  });
});
