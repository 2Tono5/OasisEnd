import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (isRegistering) {
            // Registro
            await apiService.signup(email, password, fullName);
            // Auto login después de registro
            await login(email, password);
        } else {
            // Login
            await login(email, password);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
            <i className="fas fa-seedling text-6xl text-emerald-500 dark:text-violet-400 mb-4 transition-colors" aria-hidden="true"></i>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-center transition-colors">
              Monitor Oasis
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 transition-colors">
                {isRegistering ? 'Crea tu cuenta para comenzar' : 'Inicia sesión para cuidar de tu jardín'}
            </p>
        </div>
      
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border dark:border-slate-800 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">
                {isRegistering && (
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nombre Completo
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={isRegistering}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-violet-500 transition"
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="tu@correo.com"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-violet-500 transition"
                        />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-violet-500 transition"
                        />
                </div>

                {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

                <div className="pt-2 space-y-3">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>
                    
                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                        >
                            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;