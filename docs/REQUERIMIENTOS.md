# Trazabilidad de Requerimientos - Monitor Oasis de Orquídeas

Este documento detalla cómo el **Prototipo de Software (MVP)** cumple con cada uno de los requerimientos funcionales definidos para el caso de la empresa.

## 1. Monitoreo Ambiental en Tiempo Real
**Requerimiento:** El sistema debe permitir visualizar la temperatura y humedad actual del invernadero desde cualquier lugar.
*   **Implementación:**
    *   **Frontend:** `pages/DashboardPage.tsx` utiliza el componente `DataCard.tsx` para mostrar los valores más recientes.
    *   **Backend:** Función `getLatestReadingsBySystemId` en `services/supabaseService.ts`.
    *   **Base de Datos:** Tabla `environmental_readings` consultada con orden descendente por fecha.
    *   **Estado:** ✅ Cumplido.

## 2. Visualización de Historial
**Requerimiento:** Los usuarios deben poder consultar el comportamiento de las variables ambientales en las últimas 24 horas para identificar patrones.
*   **Implementación:**
    *   **Frontend:** Componente `HistoryChart.tsx` (gráfico de líneas) y `HistoryLog.tsx` (tabla detallada).
    *   **Lógica:** `utils/chartUtils.ts` procesa los datos crudos para agruparlos temporalmente.
    *   **Backend:** Función `getReadingsBySystemId` filtra registros `gte` (mayor o igual) a 24 horas atrás.
    *   **Estado:** ✅ Cumplido.

## 3. Gestión de Sensores e Infraestructura
**Requerimiento:** El sistema debe soportar múltiples zonas o invernaderos y permitir la asociación de sensores físicos específicos.
*   **Implementación:**
    *   **Frontend:** `pages/SensorsPage.tsx` permite registrar sensores vinculando un ID físico (Hardware ID) con un nombre lógico.
    *   **Backend:** Tablas `systems` y `sensors` con relación uno a muchos.
    *   **Seguridad:** Políticas RLS aseguran que un usuario solo gestione sus propios sensores.
    *   **Estado:** ✅ Cumplido.

## 4. Programación de Riego
**Requerimiento:** Permitir al cuidador establecer y recordar la frecuencia de riego óptima.
*   **Implementación:**
    *   **Frontend:** `pages/SchedulePage.tsx` ofrece un formulario para definir fecha y frecuencia.
    *   **Visualización:** Componente `ScheduleManager.tsx` en el Dashboard muestra el próximo riego programado.
    *   **Backend:** Tabla `watering_schedules` y función `upsertWateringSchedule`.
    *   **Estado:** ✅ Cumplido.

## 5. Seguridad y Acceso
**Requerimiento:** El acceso debe ser restringido a usuarios autorizados y cada usuario debe ver solo su propia información.
*   **Implementación:**
    *   **Autenticación:** Integración completa con Supabase Auth en `contexts/AuthContext.tsx` y `pages/LoginPage.tsx`.
    *   **Autorización:** Implementación de Row Level Security (RLS) en PostgreSQL (ver `database/schema.sql`).
    *   **Estado:** ✅ Cumplido.
