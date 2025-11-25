
import React, { useState } from 'react';
import type { WateringSchedule } from './types/index';
import Header from './components/Header';
import ErrorDisplay from './components/ErrorDisplay';
import LoginPage from './pages/LoginPage';
import SchedulePage from './pages/SchedulePage';
import SensorsPage from './pages/SensorsPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './contexts/AuthContext';
import { useSystemData } from './hooks/useSystemData';

type View = 'dashboard' | 'schedule' | 'sensors';

const App: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const {
    loading: dataLoading,
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
  } = useSystemData();

  const handleScheduleUpdate = (updatedSchedule: WateringSchedule) => {
    setWateringSchedule(updatedSchedule);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <i className="fas fa-spinner fa-spin fa-3x text-emerald-500 dark:text-violet-400" aria-label="Cargando datos"></i>
        </div>
      );
    }

    if (error) {
      return <ErrorDisplay message={error} onRetry={retryFetch} />;
    }

    if (currentView === 'sensors') {
      return (
        <SensorsPage 
          sensors={sensors}
          selectedSystem={selectedSystem}
          onCreateSensor={handleCreateSensor}
          onDeleteSensor={handleDeleteSensor}
        />
      );
    }

    if (currentView === 'dashboard') {
      return (
        <DashboardPage
          systems={systems}
          selectedSystem={selectedSystem}
          onSystemChange={handleSystemChange}
          sensors={sensors}
          selectedSensorId={String(selectedSensorId)}
          onSensorChange={handleSensorChange}
          latestReadings={latestReadings}
          chartData={chartData}
          historicalReadings={historicalReadings}
          wateringSchedule={wateringSchedule}
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onNavigateToSensors={() => setCurrentView('sensors')}
          onCreateSystem={handleCreateSystem}
        />
      );
    }

    if (currentView === 'schedule' && selectedSystem) {
        return (
            <SchedulePage 
                initialSchedule={wateringSchedule} 
                systemId={selectedSystem.id}
                onScheduleUpdate={handleScheduleUpdate}
            />
        );
    }
    
    return null;
  };
  
  if (authLoading) {
     return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center items-center transition-colors duration-300">
          <i className="fas fa-spinner fa-spin fa-3x text-emerald-500 dark:text-violet-400" aria-label="Cargando aplicación"></i>
        </div>
      );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Header 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-slate-500 dark:text-slate-400 text-sm transition-colors">
        <p>Prototipo Monitor Oasis de Orquídeas &copy; 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
