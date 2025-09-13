# E2E Test Tasks

The following application flows are good candidates for additional Playwright coverage. Each scenario should authenticate with valid test credentials and verify both the expected UI state and network interactions.

- **Sidebar navigation** – ensure every dashboard link loads the right page and highlights the active route.
- **Access management** – list existing accesses; create, update and delete entries; confirm real-time updates via WebSocket.
- **User management** – create users, assign roles, update passwords and remove accounts.
- **Device management** – display registered devices, add a new device and delete an existing one.
- **Forms** – open the form builder, submit a form and verify results in the summary view.
- **Correspondence** – send a correspondence item and confirm it appears in the list with correct details.
- **Memos** – create a memo, mark it read/unread and delete it from the table.
- **Shifts** – start and end a shift, capture audio and check the shift history shows the new record.
- **Profile & settings** – update profile information and toggle language preferences.
- **Notifications** – ensure notifications list loads and entries can be marked as read.
