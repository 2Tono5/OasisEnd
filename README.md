
# Monitor Oasis de Orquídeas

Un prototipo web para monitorear las condiciones ambientales de un invernadero de orquídeas. Muestra la temperatura y humedad en tiempo real, registra datos históricos y ayuda a gestionar los horarios de riego para garantizar condiciones óptimas de crecimiento.

## ✨ Características

- **Dashboard en Tiempo Real:** Visualiza la temperatura y humedad actuales con indicadores de estado óptimo.
- **Historial Gráfico:** Gráficos interactivos que muestran las tendencias de las últimas 24 horas.
- **Registro Detallado:** Una tabla con todas las lecturas individuales para un análisis más profundo.
- **Gestión de Múltiples Sistemas y Sensores:** Soporte para monitorear diferentes invernaderos o zonas, cada una con múltiples sensores.
- **Gestión de Sensores:** Permite registrar y eliminar sensores, vinculando el ID del hardware físico con la plataforma.
- **Calendario de Riego:** Programa y visualiza el próximo evento de riego.
- **Autenticación Segura:** Sistema de registro e inicio de sesión de usuarios gestionado por Supabase Auth.

## 🚀 Stack Tecnológico

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend y Base de Datos:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Gráficos:** Recharts
- **Iconos:** FontAwesome

## 📂 Estructura del Proyecto

El proyecto ha sido organizado en una estructura modular para facilitar la mantenibilidad y escalabilidad.

```
/
├── __tests__/           # Pruebas unitarias
│   ├── components/
│   ├── services/
│   └── utils/
├── components/         # Componentes de UI reutilizables
├── constants/          # Constantes de la aplicación
├── contexts/           # Contextos de React (ej. AuthContext)
├── hooks/              # Hooks personalizados (ej. useSystemData)
├── pages/              # Componentes que representan páginas completas
├── services/           # Lógica de comunicación con la API de Supabase
├── supabase/           # Configuración del cliente de Supabase
├── types/              # Definiciones de tipos de TypeScript
├── utils/              # Funciones de utilidad
├── App.tsx             # Componente raíz y enrutador principal
├── index.html          # Punto de entrada HTML
└── index.tsx           # Punto de montaje de la aplicación React
```

## ⚙️ Configuración de Supabase

Para que la aplicación funcione correctamente, es crucial configurar la base de datos y las políticas de seguridad (RLS) en Supabase.

### 1. Tablas
Asegúrate de que tu base de datos tenga las tablas definidas en el esquema proporcionado anteriormente (`profiles`, `systems`, `sensors`, `environmental_readings`, `watering_schedules`).

### 2. Políticas de Seguridad (RLS)
La Seguridad a Nivel de Fila (RLS) debe estar activada para todas las tablas. Ejecuta el siguiente SQL en el **SQL Editor** de tu panel de Supabase para aplicar los permisos necesarios.

```sql
-- Habilitar RLS para cada tabla (si no lo has hecho)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watering_schedules ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA 'profiles'
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Los usuarios pueden ver y actualizar sus propios perfiles" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- POLÍTICAS PARA 'systems'
CREATE POLICY "Los usuarios pueden crear sistemas" ON public.systems FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden ver sus propios sistemas" ON public.systems FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- POLÍTICAS PARA 'sensors'
CREATE POLICY "Los usuarios pueden crear sensores para sus propios sistemas" ON public.sensors FOR INSERT TO authenticated WITH CHECK (system_id IN (SELECT id FROM public.systems WHERE user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden gestionar los sensores de sus propios sistemas" ON public.sensors FOR ALL TO authenticated USING (system_id IN (SELECT id FROM public.systems WHERE user_id = auth.uid()));

-- POLÍTICAS PARA 'watering_schedules' (y otras tablas si es necesario)
-- ...Añade políticas similares para el resto de tablas...
```

### 3. Edge Function (`receive-reading`)
La función que recibe los datos del NodeMCU debe tener los `Secrets` `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` configurados en el panel de Edge Functions para poder escribir en la base de datos.

## 📦 Instalación y Ejecución Local

Este proyecto está diseñado para funcionar en un entorno de desarrollo simple sin un `build step`. Simplemente abre `index.html` en un navegador compatible con `importmap`.

1.  **Clona el repositorio.**
2.  **Configura tus credenciales:** Edita el archivo `supabase/client.ts` con la URL y la `anon key` de tu proyecto de Supabase.
3.  **Abre `index.html`** en tu navegador.

## 🧪 Pruebas

He añadido pruebas unitarias utilizando una sintaxis similar a Jest/Vitest. Para ejecutarlas, necesitarías configurar un entorno de pruebas.

### Configuración con Vitest (Recomendado)

1.  **Instala las dependencias de desarrollo:**
    ```bash
    npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
    ```
2.  **Crea un archivo de configuración `vitest.config.ts`:**
    ```ts
    import { defineConfig } from 'vitest/config';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './__tests__/setup.ts', // Archivo de setup para mocks
      },
    });
    ```
3.  **Ejecuta las pruebas:**
    ```bash
    npx vitest
    ```

## ⚡️ Rendimiento

- **Memoización:** Se ha utilizado `React.memo` en componentes como `DataCard` y `HistoryLog` para prevenir re-renderizados innecesarios.
- **Hooks Optimizados:** El uso de `useCallback` y `useEffect` con los arrays de dependencias correctos minimiza la ejecución de lógica pesada.
- **Herramientas de Monitoreo:** Se recomienda usar las herramientas de desarrollo del navegador (Profiler, Lighthouse) para identificar cuellos de botella en el rendimiento y optimizar según sea necesario.
