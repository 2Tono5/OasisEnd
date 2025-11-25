import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type View = 'dashboard' | 'schedule' | 'sensors';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth(); // Usar el hook de autenticación propio

  const handleLogout = async () => {
    await logout();
  };
  
  const NavLink: React.FC<{view: View, text: string}> = ({ view, text }) => {
    const isActive = currentView === view;
    return (
        <button 
            onClick={() => onNavigate(view)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-emerald-500 text-white dark:bg-violet-600 dark:text-white' 
                : 'text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300'
            }`}
        >
            {text}
        </button>
    );
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <i className="fas fa-seedling text-3xl text-emerald-500 dark:text-violet-400 transition-colors" aria-hidden="true"></i>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
               Oasis de Orquídeas
             </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
             <NavLink view="dashboard" text="Dashboard" />
             <NavLink view="sensors" text="Sensores" />
             <NavLink view="schedule" text="Calendario" />
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-violet-500"
              aria-label="Toggle Dark Mode"
            >
               <span className="sr-only">Toggle Dark Mode</span>
               <span
                 className={`${
                   theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                 } inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-200 ease-in-out flex items-center justify-center shadow-sm`}
               >
                 {theme === 'dark' ? (
                   <i className="fas fa-moon text-violet-500 text-xs"></i>
                 ) : (
                   <i className="fas fa-sun text-amber-500 text-xs"></i>
                 )}
               </span>
            </button>

            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center space-x-2"
              aria-label="Cerrar sesión"
            >
               <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
               <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;