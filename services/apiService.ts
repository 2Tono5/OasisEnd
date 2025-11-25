
import { 
  System, 
  Sensor, 
  EnvironmentalReading, 
  WateringSchedule, 
  RawEnvironmentalReading 
} from '../types/index';

// CAMBIA ESTA URL POR LA DE RENDER CUANDO TENGAS EL BACKEND SUBIDO
// Para local usa: 'http://localhost:3000/api'
// Para producción usa: 'https://tu-proyecto-backend.onrender.com/api'
const API_URL = 'https://oasisend.onrender.com/api';

export const apiService = {
  // --- AUTENTICACIÓN ---
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Error en login');
    return response.json();
  },

  async signup(email: string, password: string, fullName: string) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    if (!response.ok) throw new Error('Error en registro');
    return response.json();
  },

  // --- SISTEMAS ---
  async getSystems(userId: string): Promise<System[]> {
    const response = await fetch(`${API_URL}/systems/${userId}`);
    if (!response.ok) throw new Error('Error cargando sistemas');
    return response.json();
  },

  async createSystem(userId: string, name: string): Promise<System> {
    const response = await fetch(`${API_URL}/systems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, name }),
    });
    if (!response.ok) throw new Error('Error creando sistema');
    return response.json();
  },

  // --- SENSORES ---
  async getSensors(systemId: string): Promise<Sensor[]> {
    const response = await fetch(`${API_URL}/sensors/${systemId}`);
    if (!response.ok) throw new Error('Error cargando sensores');
    return response.json();
  },

  async createSensor(sensor: Omit<Sensor, 'created_at'>): Promise<Sensor> {
    const response = await fetch(`${API_URL}/sensors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sensor),
    });
    if (!response.ok) throw new Error('Error creando sensor');
    return response.json();
  },

  // --- LECTURAS ---
  async getReadings(systemId: string): Promise<EnvironmentalReading[]> {
    const response = await fetch(`${API_URL}/readings/${systemId}`);
    if (!response.ok) throw new Error('Error cargando lecturas');
    
    const rawReadings: RawEnvironmentalReading[] = await response.json();
    
    // Transformar datos para el frontend
    return rawReadings.map(r => ({
      id: r.id,
      sensor_id: r.sensor_id,
      value: r.temperature || r.humidity || 0, // Fallback simple
      created_at: r.created_at,
      sensor_type: r.temperature !== undefined ? 'temperature' : 'humidity', // Inferencia simple
      sensor_name: r.sensors?.name || 'Sensor'
    })).flatMap(r => {
        // El backend devuelve objetos con temp Y humidity juntos, el frontend espera separados
        // Esta es una adaptación rápida. Lo ideal es que el backend devuelva la estructura exacta.
        const res = [];
        const raw = rawReadings.find(raw => raw.id === r.id);
        if(raw) {
            if(raw.temperature !== undefined) res.push({...r, value: raw.temperature, sensor_type: 'temperature'});
            if(raw.humidity !== undefined) res.push({...r, value: raw.humidity, sensor_type: 'humidity'});
        }
        return res;
    });
  },

  // --- CALENDARIO ---
  async getSchedule(systemId: string): Promise<WateringSchedule | null> {
    const response = await fetch(`${API_URL}/schedule/${systemId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Error cargando calendario');
    return response.json();
  },

  async saveSchedule(schedule: any): Promise<WateringSchedule> {
    const response = await fetch(`${API_URL}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) throw new Error('Error guardando calendario');
    return response.json();
  }
};
