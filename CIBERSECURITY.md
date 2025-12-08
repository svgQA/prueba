# Informe de Ciberseguridad

## Metodología
- Revisión estática del código fuente en TypeScript/Preact.
- Búsqueda de configuraciones inseguras y manejo de credenciales.
- Evaluación de almacenamiento local/cookies y flujos de red.
- Revisión de endpoints OAuth y configuración de servicios.

## Hallazgos

### 1. Redirecciones OAuth usando HTTP sin cifrado (riesgo de secuestro de sesión)
**Dónde se observa:** En la configuración de AWS Amplify/Cognito los URIs de inicio/cierre de sesión están fijados a `http://localhost:3050/...` sin variante segura ni control de entorno.【F:src/aws-exports.ts†L8-L41】

**Impacto:**
- En entornos no locales o en túneles de preproducción, el código de autorización podría intercambiarse en claro, permitiendo MITM y robo del token de sesión.
- Al estar embebido en el bundle, estas URLs podrían desplegarse por error en producción, facilitando redirecciones abiertas hacia dominios no cifrados.

**Cómo mitigar:**
- Externalizar los URIs de redirección a variables de entorno por entorno y exigir `https://` en despliegues no locales.
- Habilitar verificación estricta de dominios permitidos en Cognito y añadir parámetro `state`/PKCE si no está ya gestionado por Amplify.

### 2. Cookies sin atributo `SameSite` válido y colisión de instancia de almacenamiento (riesgo de CSRF y fuga de tokens)
**Dónde se observa:** El helper de almacenamiento usa un singleton compartido para localStorage y cookies, lo que provoca que `cookieStorage` reutilice la primera instancia creada; además el atributo se emite como `samesite=` en minúsculas.【F:src/utils/storage.ts†L27-L197】

**Impacto:**
- Las cookies emitidas pueden quedar sin atributo `SameSite` reconocido por navegadores modernos, quedando expuestas a CSRF o envío cross-site involuntario.
- Como ambas instancias comparten estado, cualquier llamada que pretenda usar cookies podría terminar persistiendo valores sensibles en `localStorage`, exponiéndolos a XSS y sincronización inesperada entre pestañas.

**Cómo mitigar:**
- Separar la creación de instancias (`Storage.instance`) por tipo o eliminar el singleton compartido para que `cookieStorage` sea realmente independiente.
- Emitir el atributo exactamente como `SameSite` y aplicar reglas: `None` sólo junto a `Secure`; `Lax`/`Strict` para cookies sensibles.
- Para credenciales, preferir cookies `HttpOnly` configuradas desde el servidor en lugar de storage accesible desde JavaScript.

### 3. Fallback inseguro para URLs de servicios y envío automático de credenciales (riesgo de exfiltración de tokens)
**Dónde se observa:**
- Las URL de servicios se derivan directamente de variables de entorno sin validación ni esquema seguro y caen por defecto en `http://localhost:8080` si faltan valores.【F:src/utils/network/utils/constants.ts†L14-L31】【F:src/utils/network/utils/build.ts†L1-L14】
- El cliente adjunta automáticamente el header `Authorization` con el token actual a cualquier URL construida, incluso si apunta a un dominio no deseado.【F:src/utils/network/utils/service.ts†L86-L160】

**Impacto:**
- Una variable de entorno mal configurada o manipulada en tiempo de build podría redirigir tráfico (incluido el token Bearer) a un host no confiable.
- El uso de HTTP por defecto expone credenciales a sniffing y facilita ataques de downgrade si el gateway no fuerza HTTPS.

**Cómo mitigar:**
- Validar las URLs de servicio en tiempo de arranque: permitir sólo hosts de una lista blanca y rechazar esquemas no `https` en entornos productivos.
- Establecer valores por defecto seguros (vacío/fallo explícito) en lugar de `http://localhost:8080` y registrar un error bloqueante cuando falten variables críticas.
- Considerar evitar enviar `Authorization` a orígenes distintos (`same-origin check`) y soportar `fetch` con `credentials` controladas para proteger cookies con `SameSite`.

### 4. Token de acceso expuesto en parámetros de WebSocket y verbosidad de logging (riesgo de exfiltración y replay)
**Dónde se observa:** Al abrir el socket en Phoenix se adjuntan `token` y `cognito` como parámetros de consulta (`params`) y el canal registra eventos de conexión/errores con `console.log`/`console.warn`, potencialmente incluyendo los parámetros si el backend responde con eco.【F:src/utils/socket/manager/manager.ts†L1-L87】

**Impacto:**
- Los tokens viajan en la cadena de consulta (`?token=...`) donde quedan almacenados en historiales, proxies y registros intermedios, facilitando su captura o replay.
- Los logs del cliente pueden exponer tokens en entornos compartidos (soporte, Sentry, DevTools) o ser interceptados por extensiones maliciosas.

**Cómo mitigar:**
- Autenticar el WebSocket con un header o subprotocolo y no mediante query params; evitar registrar los valores sensibles en consola.
- Regenerar tokens cortos específicos para WebSocket y revocarlos al cerrar sesión; usar `wss://` y validar certificados.

### 5. Socket sin control de reconexión segura ni backoff (riesgo de inundación y agotamiento de credenciales)
**Dónde se observa:** La gestión de sockets no implementa límites de reintentos, backoff ni invalidación del canal cuando el estado queda en error; simplemente vuelve a conectarse con las credenciales actuales en cada invocación externa.【F:src/utils/socket/manager/manager.ts†L30-L87】【F:src/pages/dashboard/dashboard.layout.tsx†L84-L128】

**Impacto:**
- Un atacante que provoque cierres frecuentes (por ejemplo, respuestas 401 o throttling del gateway) puede forzar reconexiones rápidas y múltiples envíos del token, incrementando superficie de fuga y riesgo de bloqueo de cuenta.
- Sin rotación ni comprobación de validez previa a cada reconexión, pueden usarse tokens expirados que revelan información de error del servidor.

**Cómo mitigar:**
- Implementar backoff exponencial y número máximo de reintentos antes de requerir renovación de token o reautenticación del usuario.
- Validar el estado del token antes de reconectar y limpiar listeners para evitar desbordes de memoria o suscripciones duplicadas.

### 6. Falta de validaciones de integridad y caducidad para tokens persistidos (riesgo de sesión prolongada y uso tras robo)
**Dónde se observa:** El store de usuario devuelve el token sin verificar expiración y lo añade directamente en headers y sockets (`Bearer ${token}`), sin comprobación de claims ni refresco obligatorio; el helper de storage permite persistir indefinidamente por defecto (365 días).【F:src/store/slices/access/user.slice.ts†L143-L170】【F:src/utils/storage.ts†L1-L98】

**Impacto:**
- Tokens guardados en `localStorage` o cookies largas pueden seguir siendo aceptados si se filtran (phishing, XSS), prolongando ventanas de compromiso.
- Al no validar la expiración, la app puede enviar tokens caducados, recibiendo mensajes de error que pueden revelar metadatos del backend y degradar la experiencia de usuario.

**Cómo mitigar:**
- Almacenar sólo tokens de corta vida y verificar el `exp` (o equivalente) antes de cada uso; forzar refresco o re-login cuando se acerque la caducidad.
- Reducir la caducidad por defecto en `Storage` y diferenciar políticas para credenciales (p. ej., usar Session Storage o cookies HttpOnly con expiración corta y `SameSite=Strict`).

### 7. Telemetría envia Bearer y metadatos sensibles sin aislamiento ni rotación (riesgo de filtración de credenciales y PII)
**Dónde se observa:** La inicialización de Grafana Faro adjunta `Authorization` con el token completo y los headers `voxline-tenant`/`voxline-company` a cada envío de telemetría, reutilizando el primer token capturado porque sólo se inicializa una vez y no se reinicia al rotar de usuario o renovar sesión.【F:src/utils/telemetry/faro.ts†L1-L51】

**Impacto:**
- La telemetría puede exfiltrar el Bearer al endpoint configurado (`${default_service_url}/telemetry/faro/collect`), que podría ser un dominio distinto o con logs accesibles a terceros.
- Si cambia el usuario o se renueva el token, Faro seguirá usando el token inicial, generando fugas de datos entre sesiones y solicitudes autenticadas con credenciales caducadas.

**Cómo mitigar:**
- Evitar enviar el Bearer en telemetría; usar claves específicas de observabilidad o intercambio backend-backend para adjuntar autenticación mínima y rotada.
- Reinitializar Faro en cada login/logout o cuando se renueve el token para asegurar que los headers reflejen la sesión vigente y permitir desactivar telemetría en entornos sensibles.
- Segmentar el dominio de telemetría (subdominio dedicado, TLS estricto) y aplicar redacción/sampling de eventos para evitar captura de PII.

### 8. Estado de sesión no se limpia en logout ni se purga la preferencia persistida (riesgo de reuso de contexto y confusión de identidad)
**Dónde se observa:** La acción `cleanUserStore` se limita a limpiar el estado en memoria y no borra la selección de compañía/lugar guardada en `localStorage`, ni garantiza cierre de sockets o telemetría antes de cerrar sesión; el cierre se invoca dos veces pero sin purga de storage.【F:src/store/slices/access/user.slice.ts†L143-L170】【F:src/pages/dashboard/dashboard.layout.tsx†L210-L239】

**Impacto:**
- Un nuevo login en el mismo navegador puede heredar la última compañía/lugar y, si la sesión anterior seguía conectada, reusar accidentalmente el contexto multi-tenant previo.
- Persistir selecciones e identificadores sin logout efectivo aumenta el riesgo de confusión de identidad y exposición de datos entre usuarios que comparten dispositivo.

**Cómo mitigar:**
- En el flujo de logout, limpiar `localStorage`/cookies relacionadas con tenant, compañía, lugar y tokens, y cerrar sockets/telemetría antes de destruir el estado.
- Asociar las preferencias persistidas a un identificador de usuario cifrado/firme y eliminarlas cuando se detecte cambio de identidad o expiración de sesión.

## Recomendaciones de hardening
- Implementar Content Security Policy estricta que minimice riesgo de XSS y reduzca exposición de `localStorage` si se mantienen tokens en el cliente.
- Añadir validaciones en CI para impedir commits con URLs sin HTTPS en configuraciones de OAuth o servicios.
- Introducir un mecanismo de rotación y expiración corta para tokens almacenados en cliente, acompañado de revalidación con Refresh Token seguro.

## Herramientas sugeridas para análisis y mitigación
- **SAST:** Semgrep, ESLint con reglas de seguridad, SonarJS para revisar patrones de storage y fetch.
- **DAST:** OWASP ZAP o Burp Suite para probar flujos OAuth y detección de redirecciones inseguras.
- **Análisis de dependencias:** `npm audit`, `pnpm audit`, `snyk test` para vulnerabilidades de paquetes.
- **Hardening del navegador:** CSP Evaluator (Google) para validar políticas de contenido; Report-URI para monitoreo de violaciones.
- **Validación de configuración:** Scripts de CI que verifiquen presencia de `https` en variables sensibles y prohíban defaults inseguros.
