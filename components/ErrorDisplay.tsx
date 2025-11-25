
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl shadow-lg text-red-800 dark:text-red-200 text-center p-4 transition-colors">
      <i className="fas fa-exclamation-triangle fa-3x mb-4 text-red-500 dark:text-red-400" aria-hidden="true"></i>
      <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">Error de Conexión</h2>
      <p className="mt-2 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 bg-emerald-500 hover:bg-emerald-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 dark:focus:ring-offset-slate-900 focus:ring-emerald-400 dark:focus:ring-violet-500"
      >
        <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>
        Reintentar
      </button>
    </div>
  );
};

export default ErrorDisplay;
