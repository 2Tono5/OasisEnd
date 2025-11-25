# Plan de Pruebas de Integración - Monitor Oasis de Orquídeas

## Objetivo
Validar que todos los componentes del sistema (Microcontrolador, Backend Supabase, Frontend React) interactúan correctamente para cumplir con los requerimientos del negocio.

## Entorno de Pruebas
*   **Hardware:** NodeMCU ESP8266 con sensor DHT11 simulado o real.
*   **Software:** Navegador Google Chrome (Versión más reciente).
*   **Red:** Conexión WiFi estable con acceso a internet.

---

## Casos de Prueba

### Caso 1: Flujo de Registro y Creación de Infraestructura
**Descripción:** Verificar que un nuevo usuario puede registrarse y configurar su entorno digital.
1.  **Acción:** Ingresar a la aplicación y seleccionar "Registrarse".
2.  **Acción:** Crear cuenta con email válido.
3.  **Verificación:** El sistema redirige al usuario o solicita confirmación. Se crea registro en tabla `auth.users` y `public.profiles`.
4.  **Acción:** En el Dashboard, hacer clic en "Crear mi primer sistema".
5.  **Acción:** Ingresar nombre "Invernadero Principal".
6.  **Verificación:** El sistema aparece en el selector del Dashboard. Se crea registro en tabla `systems`.

### Caso 2: Integración de Hardware (Sensor)
**Descripción:** Verificar que se puede registrar un sensor físico y que el sistema lo reconoce.
1.  **Acción:** Navegar a la pestaña "Sensores".
2.  **Acción:** Registrar nuevo sensor:
    *   ID: `101` (Debe coincidir con el código en `NodeMCU_Oasis.ino`).
    *   Nombre: "Sensor Orquídeas A".
    *   Ubicación: "Zona Norte".
3.  **Verificación:** El sensor aparece en la lista de sensores registrados. Se crea registro en tabla `sensors`.

### Caso 3: Flujo de Datos en Tiempo Real (End-to-End)
**Descripción:** Verificar que los datos enviados por el microcontrolador aparecen en la pantalla.
1.  **Pre-condición:** El sensor ID `101` está registrado en la Web y configurado en el firmware.
2.  **Acción:** Encender el NodeMCU.
3.  **Observación (Hardware):** El Monitor Serial muestra "Código HTTP: 200" o "201".
4.  **Observación (Frontend):** Esperar 10-15 segundos o recargar Dashboard.
5.  **Verificación:** Las tarjetas de "Temperatura" y "Humedad" muestran valores distintos a "--". Los valores coinciden con los leídos por el sensor.

### Caso 4: Historial y Gráficos
**Descripción:** Verificar la persistencia y visualización histórica.
1.  **Acción:** Dejar el sistema operando por 30 minutos (o simular inserción de múltiples datos en la BD).
2.  **Acción:** Observar el gráfico en el Dashboard.
3.  **Verificación:** Se dibuja una línea de tendencia.
4.  **Verificación:** La tabla "Historial Detallado" muestra múltiples filas con marcas de tiempo ordenadas descendentemente.

### Caso 5: Gestión de Riego
**Descripción:** Verificar la funcionalidad de la agenda.
1.  **Acción:** Navegar a "Calendario".
2.  **Acción:** Configurar fecha para mañana a las 08:00 AM y frecuencia de 2 días.
3.  **Acción:** Guardar.
4.  **Verificación:** Mensaje de éxito. Al volver al Dashboard, la tarjeta de "Calendario de Riego" muestra la fecha correcta.

### Caso 6: Control de Errores y Resiliencia
**Descripción:** Verificar comportamiento ante fallos.
1.  **Acción:** Desconectar internet o apagar servidor de BD (simulado).
2.  **Verificación:** La aplicación muestra el componente `ErrorDisplay` con opción de reintentar, en lugar de una pantalla blanca o rota.
3.  **Acción:** Restablecer conexión y pulsar "Reintentar".
4.  **Verificación:** Los datos se cargan correctamente.
