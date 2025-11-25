
export interface Profile {
  id: string;
  updated_at: string;
  full_name: string;
  avatar_url: string;
}

export interface System {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Sensor {
  id: number; // Corregido a number para coincidir con el tipo int4 de la DB
  system_id: string;
  name: string;
  location: string;
  created_at: string;
  update_frequency?: number;
}

// Representa la fila tal como viene de la tabla environmental_readings
export interface RawEnvironmentalReading {
  id: string | number;
  created_at: string;
  temperature: number;
  humidity: number;
  sensor_id: number;
  sensors: { // De la relación !inner
    name: string;
    system_id: string;
  };
}


// Representa una única lectura de un sensor.
export interface EnvironmentalReading {
  id: string | number;
  sensor_id: number; // Corregido a number para coincidir con el tipo int4 de la DB
  value: number;
  created_at: string;
  sensor_type: string; // Ej: 'temperature', para facilitar el procesamiento
  sensor_name: string;
}

// Estructura de datos para los componentes, combinando lecturas por timestamp
export interface CombinedReading {
  timestamp: string;
  time: string; // Formateado para gráficos
  temperature?: number;
  humidity?: number;
}


export interface WateringSchedule {
  id: string;
  system_id: string;
  created_at: string;
  next_watering_time: string;
  frequency_days: number;
  is_active: boolean;
}
