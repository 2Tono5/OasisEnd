
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CombinedReading } from '../types/index';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryChartProps {
  data: CombinedReading[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 vs slate-200
  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 vs slate-500
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'; // slate-800 vs white
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#334155';

  const tempColor = isDark ? '#fbbf24' : '#f59e0b'; // Amber-400 vs Amber-500
  const humidityColor = isDark ? '#38bdf8' : '#0ea5e9'; // Sky-400 vs Sky-500

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
        <p>No hay suficientes datos para mostrar el gráfico.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="time" stroke={textColor} fontSize={12} tick={{ fill: textColor }} />
        <YAxis stroke={textColor} fontSize={12} tick={{ fill: textColor }} />
        <Tooltip
            contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                color: tooltipText
            }}
            labelStyle={{ color: tooltipText }}
            itemStyle={{ fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{fontSize: "14px", color: textColor}} />
        <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke={tempColor} strokeWidth={2} dot={false} connectNulls />
        <Line type="monotone" dataKey="humidity" name="Humedad (%)" stroke={humidityColor} strokeWidth={2} dot={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
