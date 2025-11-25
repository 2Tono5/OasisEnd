
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface PlantStatusProps {
  temperature?: number;
  humidity?: number;
}

const PlantStatus: React.FC<PlantStatusProps> = ({ temperature, humidity }) => {
  const { theme } = useTheme();
  
  let status = 'happy';
  let message = '¡Me siento genial!';
  let icon = 'fa-smile-beam';
  let colorClass = 'text-emerald-500 dark:text-emerald-400';
  let animation = 'animate-bounce';

  if (temperature === undefined || humidity === undefined) {
    status = 'sleeping';
    message = 'Esperando datos...';
    icon = 'fa-bed';
    colorClass = 'text-slate-400';
    animation = '';
  } else {
    // Lógica simple de estado
    const isHot = temperature > 28;
    const isCold = temperature < 15;
    const isDry = humidity < 50;
    const isWet = humidity > 90;

    if (isHot && isDry) {
        status = 'dying';
        message = '¡Ayuda! Calor y sed.';
        icon = 'fa-dizzy';
        colorClass = 'text-red-500';
        animation = 'animate-pulse';
    } else if (isHot) {
        status = 'hot';
        message = 'Tengo mucho calor.';
        icon = 'fa-temperature-high';
        colorClass = 'text-orange-500';
    } else if (isCold) {
        status = 'cold';
        message = '¡Brrr! Hace frío.';
        icon = 'fa-snowflake';
        colorClass = 'text-blue-400';
    } else if (isDry) {
        status = 'thirsty';
        message = 'Necesito agua, por favor.';
        icon = 'fa-tint-slash';
        colorClass = 'text-amber-500';
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border dark:border-slate-800 transition-colors flex flex-col items-center justify-center text-center space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Estado de la Planta</h2>
      
      <div className={`text-6xl ${colorClass} ${animation} transition-all duration-500 p-4 bg-slate-50 dark:bg-slate-800 rounded-full h-32 w-32 flex items-center justify-center shadow-inner`}>
        <i className={`fas ${icon}`}></i>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{message}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
           Diagnóstico en tiempo real
        </p>
      </div>
    </div>
  );
};

export default PlantStatus;
