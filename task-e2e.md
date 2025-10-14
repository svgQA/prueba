# E2E Test Tasks

The following application flows are good candidates for additional Playwright coverage. Each scenario should authenticate with valid test credentials and verify both the expected UI state and network interactions.

- [x] **Sidebar navigation** – ensure every dashboard link loads the right page and highlights the active route.
- [x] **Access management** – list existing accesses; create, update and delete entries; confirm real-time updates via WebSocket.
- [x] **User management** – create users, assign roles, update passwords and remove accounts.
- [x] **Device management** – display registered devices, add a new device and delete an existing one.
- [x] **Forms** – open the form builder, submit a form and verify results in the summary view.
- [x] **Correspondence** – send a correspondence item and confirm it appears in the list with correct details.
- [x] **Memos** – create a memo, mark it read/unread and delete it from the table.
- [x] **Shifts** – start and end a shift, capture audio and check the shift history shows the new record.
- [x] **Profile & settings** – update profile information and toggle language preferences.
- [x] **Notifications** – ensure notifications list loads and entries can be marked as read.

## 2025-10-10

- **login.spec.ts** – después de autenticar verifico que el shell del dashboard aparezca completo (sidebar, switcher de idioma y menú de usuario) y que el widget principal de memos esté disponible para asegurar que el login conduce al estado esperado.
- **sidebar.spec.ts** – expandí la cobertura para recorrer cada ruta del sidebar validando sus tarjetas resumen y columnas clave, además de confirmar que el enlace queda resaltado. Con esto validamos navegación y contenido.
- **memos.spec.ts** – agregué validaciones sobre tarjetas de resumen, columnas de la tabla, buscador general y conmutadores de vista (tabla/pánico) para asegurar que el panel operativo responde.
- **forms.spec.ts** – ahora se comprueban las métricas superiores, las columnas de respuestas, el buscador y que las vistas deshabilitadas permanezcan bloqueadas.
- **shifts.spec.ts** – se validan tarjetas de turnos, columnas críticas y la presencia de acciones como crear turno y el buscador.
- **access.spec.ts** – se revisan las estadísticas y cabeceras de tabla más el buscador para garantizar la visibilidad de datos de accesos.
- **correspondence.spec.ts** – incorporé chequeos sobre métricas, columnas principales y filtro para asegurar seguimiento de correspondencias.
- **devices.spec.ts** – aseguré que el placeholder del módulo cargue correctamente tras autenticar, evitando falsos positivos por redirecciones.
- **notifications.spec.ts** – se validan las tarjetas analíticas, columnas del historial y disponibilidad del buscador.
- **users.spec.ts** – añadí verificaciones de tarjetas de resumen, columnas clave y buscador para el módulo de usuarios.
- **settings.spec.ts** – el test ahora abre el modal de configuración desde el sidebar y comprueba que se rendericen el perfil del usuario, el selector de idioma y el botón de cierre.
- **utils.ts** – centralicé traducciones clave y helpers reutilizables (login con espera, verificación de tarjetas, cabeceras y buscador) para reducir duplicación y asegurar consistencia en los nuevos chequeos.
