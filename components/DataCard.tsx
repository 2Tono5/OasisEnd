
import React from 'react';

interface DataCardProps {
  icon: string;
  title: string;
  value: number | undefined;
  unit: string;
  optimalRange: { min: number; max: number };
}

const getStatusColor = (value: number | undefined, range: { min: number; max: number }): string => {
  if (value === undefined) return 'text-slate-400 dark:text-slate-600';
  // Light mode: emerald, Dark mode: violet for optimal
  if (value >= range.min && value <= range.max) return 'text-emerald-500 dark:text-violet-400';
  // Light mode: sky, Dark mode: sky for low
  if (value < range.min) return 'text-sky-500 dark:text-sky-400';
  // Amber for warning
  return 'text-amber-500';
};

const DataCard: React.FC<DataCardProps> = ({ icon, title, value, unit, optimalRange }) => {
  const statusColor = getStatusColor(value, optimalRange);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 flex flex-col justify-between transform hover:scale-105 transition-all duration-300 border dark:border-slate-800">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 transition-colors">{title}</h3>
        <i className={`fas ${icon} text-2xl ${statusColor} transition-colors`} aria-hidden="true"></i>
      </div>
      <div>
        {value !== undefined ? (
          <p className={`text-5xl font-bold ${statusColor} transition-colors`}>
            {value.toFixed(1)}
            <span className="text-3xl font-medium text-slate-500 dark:text-slate-400 ml-2 transition-colors">{unit}</span>
          </p>
        ) : (
           <p className={`text-5xl font-bold ${statusColor} transition-colors`}>
            --
            <span className="text-3xl font-medium text-slate-400 dark:text-slate-600 ml-2 transition-colors">{unit}</span>
          </p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 transition-colors">Óptimo: {optimalRange.min}{unit} - {optimalRange.max}{unit}</p>
      </div>
    </div>
  );
};

export default React.memo(DataCard);
