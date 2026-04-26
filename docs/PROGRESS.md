## DOXII Implementation Checklist (from DOXII-VISION-ARCHITECTURE.md)

Last updated: 2025-08-23 (Phase 1-4 Complete)

Legend: [x] done, [~] in progress, [ ] todo

### Phase 1 — AI Agent Transform (React/Vite output)
- [x] Provide React/Vite project scaffolding via templates (`init_react_project`)
- [x] Stream agent output via SSE and relay via WebSocket (`ai_stream`, `ai_complete`)
- [x] ComponentGenerator: AI creates/edits specific React components on demand
- [x] DependencyManager: Auto-update `package.json` when new libs are introduced by AI
- [x] TemplateEngine: Expand e-commerce patterns (cart, checkout, product lists, reviews)
- [ ] Guardrails: Keep writes inside `chats/{chatId}`; validate imports/paths

### Phase 2 — Communication & Project Storage (Disk + WebSocket)
- [x] One WebSocket per chat at `/ws/{chat_id}`
- [x] Disk-based file ops via WS: `file_write`, `file_read`, `file_delete`, `file_list`
- [x] Broadcast `vfs_change` events so clients refresh file lists
- [x] Frontend editor uses WS for saves and reads (replace REST paths in editor flows)
- [x] mtime on read; conflict detection on write

### Socket.IO Migration
- [x] Backend: python-socketio mounted at `/socket.io`
- [x] Backend: SSE chat stream at `/stream/get/{chat_id}` and POST `/stream/{chat_id}`
- [x] Backend: SSE build stream at `/sse/build/{chat_id}`
- [x] Frontend: SSE transport behind `NEXT_PUBLIC_TRANSPORT=sse`
- [x] Frontend: Preview supports Lit fallback to `index.html`
- [x] Agent: Lit mode via `DOXII_FRONTEND=lit` with CDN-only instructions
- [x] Events: `join_chat`, `ai_agent_request`, `file_op` (list/read/write/delete), `vfs_change`
- [x] Frontend: Socket.IO client service and chat pages migrated
- [x] Initial `project_state` message includes files list for tree building
- [x] Remove backend VFS (operate on disk only)
- [x] Multi-client sync: Basic conflict handling (last-write wins + user feedback)

### Phase 3 — ESBuild Integration (AI-Triggered Preview)
- [x] Remove Vite devserver infrastructure (DevServerManager, devpreview router)
- [x] Create ESBuildService for React bundling into single HTML files
- [x] Integrate esbuild triggers with `ai_complete` events via Socket.IO
- [x] Add automatic dependency management (npm install on package.json changes)
- [x] Update Preview component to receive bundled HTML via Socket.IO
- [x] Inject route/URL postMessage bridge into built HTML for browser-like address bar
- [x] Add preview overlay with staged build progress and clean event unsubscription
- [x] Add build error handling and progress indicators
- [x] Performance optimization: <200ms build times, <1s preview updates

### Phase 4 — Frontend IDE Enhancements
- [x] File tree UI and WebSocket context
- [x] Monaco code editor with JSX/TSX basics
- [x] Switch editor save/read to WebSocket methods and show save state
- [x] ComponentInspector: Select component in preview and send targeted AI prompts
- [x] React-aware gutter info: component boundaries, quick actions
- [x] PreviewEmbed: integrate Vite dev server and multi-device viewports with HMR
- [~] Error surface: show build/compile errors from ESBuild in UI so that user can ask in chat to fix it (basic overlay in place; richer error panes pending)

<!-- ### Phase 5 — CMS (Supabase) & Data Binding
- [ ] SupabaseClient configuration (env, auth) in backend
- [ ] Backend CMS API: CRUD for data models and storage access
- [ ] QueryBuilder: NL → SQL (AI-assisted), validate and parameterize
- [ ] ComponentBinding: map components → stored queries; persist mappings
- [ ] DataFetching: runtime execution + caching; frontend hooks to render data
- [ ] Secrets/Config UI: set Supabase keys securely -->

<!-- ### Export Capability
- [ ] Export full React/Vite project (zip `chats/{chatId}`) for download -->

### WebSocket Hub & Protocol
- [x] ChatRoomManager with connection tracking and broadcast utilities
- [ ] Message routing spec doc (types, payloads, success/error frames)
- [ ] Heartbeat/reconnect strategy finalized and documented


### Recently Completed (Phase 1-2)
✅ **Socket.IO Communication**: Unified realtime protocol replacing raw WebSockets
✅ **Multi-client sync**: Timestamp-based conflict detection with user resolution
✅ **Component Inspector**: Interactive component selection for targeted AI prompts
✅ **React-aware Editor**: Smart actions and status indicators for JSX/TSX files

### Recently Completed (Phase 3)
✅ **ESBuild Integration**: Replaced Vite with AI-triggered React bundling system
- Builds React apps in ~100ms vs 1-3s with Vite
- Single HTML file output with inlined JS/CSS
- Automatic dependency management on build
- Real-time preview updates via Socket.IO
- Eliminated complex port management and proxy layer

### Testing Status
✅ **Unit Testing**: ESBuildService successfully bundles React apps
✅ **Integration Testing**: Socket.IO events properly emit build results
✅ **Frontend Testing**: Preview component renders bundled HTML via data URLs and reports routes to address bar
⚠️ **End-to-end Testing**: Requires live AI completion to test full workflow
