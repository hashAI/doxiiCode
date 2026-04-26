import os
import mimetypes
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import FileResponse, HTMLResponse

from app.services.chat_service import chat_service

router = APIRouter(prefix="/preview", tags=["preview"])


def _get_visual_edit_script(chat_id: str) -> str:
    """Generate Visual Edit system script for Lit-based projects without build-time injection."""
    return """
    <script>
    (function() {
        // Console error capture system
        function captureConsoleErrors() {
            var originalConsoleError = console.error;
            var originalConsoleWarn = console.warn;
            var originalWindowError = window.onerror;
            var originalUnhandledRejection = window.onunhandledrejection;
            
            // Override console.error
            console.error = function() {
                originalConsoleError.apply(console, arguments);
                var message = Array.prototype.slice.call(arguments).join(' ');
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'doxii-console-error',
                        level: 'error',
                        message: message,
                        timestamp: new Date().toISOString()
                    }, '*');
                }
            };
            
            // Override console.warn
            console.warn = function() {
                originalConsoleWarn.apply(console, arguments);
                var message = Array.prototype.slice.call(arguments).join(' ');
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'doxii-console-error',
                        level: 'warning',
                        message: message,
                        timestamp: new Date().toISOString()
                    }, '*');
                }
            };
            
            // Capture JavaScript errors
            window.onerror = function(msg, url, lineNo, columnNo, error) {
                var message = msg + ' at ' + url + ':' + lineNo + ':' + columnNo;
                if (error && error.stack) {
                    message += '\\n' + error.stack;
                }
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'doxii-console-error',
                        level: 'error',
                        message: message,
                        timestamp: new Date().toISOString(),
                        url: url,
                        lineNo: lineNo,
                        columnNo: columnNo
                    }, '*');
                }
                if (originalWindowError) {
                    return originalWindowError.apply(this, arguments);
                }
                return false;
            };
            
            // Capture unhandled promise rejections
            window.onunhandledrejection = function(event) {
                var message = 'Unhandled Promise Rejection: ' + (event.reason || 'Unknown error');
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'doxii-console-error',
                        level: 'error',
                        message: message,
                        timestamp: new Date().toISOString()
                    }, '*');
                }
                if (originalUnhandledRejection) {
                    return originalUnhandledRejection.apply(this, arguments);
                }
            };
        }
        
        // Route tracking system (existing)
        function postRoute() {
            try {
                var href = String(location.href);
                var path = location.pathname + location.search + location.hash;
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'doxii-route', href: href, path: path }, '*');
                }
            } catch (e) { }
        }
        
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        history.pushState = function() { var r = pushState.apply(this, arguments); postRoute(); return r; };
        history.replaceState = function() { var r = replaceState.apply(this, arguments); postRoute(); return r; };
        window.addEventListener('popstate', postRoute);
        window.addEventListener('hashchange', postRoute);
        
        // Visual Edit system for Lit components
        function initDoxiiHoverSystem() {
            if (window.doxiiHoverSystemInitialized) return;
            window.doxiiHoverSystemInitialized = true;

            var currentHovered = null;
            var enabled = false;
            var onMouseMove = null;
            var onClick = null;

            // Expose injectDataMeta globally for timed re-injection
            window.doxiiInjectDataMeta = injectDataMeta;
            
            // Dynamic component discovery for Lit-based projects
            function discoverComponents() {
                var componentMap = {};

                // Scan all elements in the DOM
                var allElements = document.querySelectorAll('*');
                for (var i = 0; i < allElements.length; i++) {
                    var element = allElements[i];
                    var tagName = element.tagName.toLowerCase();

                    // Check if it's a custom element (contains hyphen)
                    if (tagName.includes('-') && !componentMap[tagName]) {
                        // Convention-based file path mapping
                        var filePath = guessFilePath(tagName);
                        if (filePath) {
                            componentMap[tagName] = filePath;
                        }
                    }
                }

                return componentMap;
            }

            function guessFilePath(tagName) {
                // Convention-based mapping for common patterns
                if (tagName.startsWith('page-')) {
                    return 'pages/' + tagName + '.js';
                }
                if (tagName.startsWith('ecom-')) {
                    return 'components/' + tagName.replace('ecom-', '') + '.js';
                }
                // Default to components directory
                return 'components/' + tagName + '.js';
            }
            
            // Inject data-meta attributes into Lit components
            function injectDataMeta() {
                // Discover components dynamically every time
                var componentMap = discoverComponents();

                Object.keys(componentMap).forEach(function(tagName) {
                    var elements = document.getElementsByTagName(tagName);
                    var filePath = componentMap[tagName];

                    for (var i = 0; i < elements.length; i++) {
                        var el = elements[i];
                        if (!el.hasAttribute('data-meta')) {
                            // For Lit components, use line 1 as default since we don't have precise line info
                            el.setAttribute('data-meta', filePath + ':1:1');
                        }
                    }
                });

                // Also inject into regular HTML elements within components
                var allElements = document.querySelectorAll('*');
                for (var i = 0; i < allElements.length; i++) {
                    var el = allElements[i];
                    if (!el.hasAttribute('data-meta')) {
                        // Find parent component
                        var parentComponent = el.closest(Object.keys(componentMap).join(','));
                        if (parentComponent) {
                            var componentFile = componentMap[parentComponent.tagName.toLowerCase()];
                            if (componentFile) {
                                // Estimate line number based on element position
                                var lineEstimate = Math.max(1, Math.floor(i / 10) + 5);
                                el.setAttribute('data-meta', componentFile + ':' + lineEstimate + ':1');
                            }
                        }
                    }
                }
            }
            
            function enable() {
                if (enabled) return;
                enabled = true;

                // Inject meta attributes when enabling
                injectDataMeta();

                // Watch for new components being added to the DOM
                if (window.MutationObserver) {
                    var observer = new MutationObserver(function(mutations) {
                        var shouldReinject = false;
                        mutations.forEach(function(mutation) {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // Element node
                                    var tagName = node.tagName.toLowerCase();
                                    if (tagName.includes('-')) {
                                        shouldReinject = true;
                                    }
                                }
                            });
                        });
                        if (shouldReinject) {
                            // Small delay to ensure new components are fully rendered
                            setTimeout(injectDataMeta, 100);
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
                
                onMouseMove = function(e) {
                    var target = e.target;
                    
                    function findAnnotated(node) {
                        var n = node;
                        while (n && n !== document && !(n.getAttribute && n.hasAttribute('data-meta'))) { 
                            n = n.parentElement; 
                        }
                        return n && n.getAttribute ? n : null;
                    }
                    
                    var annotatedTarget = findAnnotated(target);
                    var metadata = annotatedTarget ? annotatedTarget.getAttribute('data-meta') : null;
                    
                    if (!metadata) {
                        if (currentHovered) {
                            currentHovered = null;
                            try { window.parent.postMessage({ type: 'doxii-hover-end' }, '*'); } catch (err) {}
                        }
                        return;
                    }
                    
                    if (annotatedTarget && annotatedTarget !== currentHovered) {
                        currentHovered = annotatedTarget;
                        var rect = annotatedTarget.getBoundingClientRect();
                        
                        if (metadata && rect.width > 0 && rect.height > 0) {
                            try {
                                window.parent.postMessage({
                                    type: 'doxii-hover',
                                    metadata: metadata,
                                    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                                    mouseX: e.clientX,
                                    mouseY: e.clientY
                                }, '*');
                            } catch (err) {}
                        }
                    }
                };
                
                onClick = function(e) {
                    var target = e.target;
                    
                    function findAnnotated(node) {
                        var n = node;
                        while (n && n !== document && !(n.getAttribute && n.hasAttribute('data-meta'))) { 
                            n = n.parentElement; 
                        }
                        return n && n.getAttribute ? n : null;
                    }
                    
                    var annotatedTarget = findAnnotated(target);
                    var metadata = annotatedTarget ? annotatedTarget.getAttribute('data-meta') : null;
                    
                    if (!metadata) return;
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var rect = annotatedTarget.getBoundingClientRect();
                    
                    try {
                        window.parent.postMessage({
                            type: 'doxii-click',
                            metadata: metadata,
                            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                        }, '*');
                    } catch (err) {}
                };
                
                document.addEventListener('mousemove', onMouseMove, { passive: true });
                document.addEventListener('click', onClick, true);
            }
            
            function disable() {
                if (!enabled) return;
                enabled = false;
                
                try { document.removeEventListener('mousemove', onMouseMove, { passive: true }); } catch (_) {}
                try { document.removeEventListener('click', onClick, true); } catch (_) {}
                
                onMouseMove = null;
                onClick = null;
                currentHovered = null;
                
                try { window.parent.postMessage({ type: 'doxii-hover-end' }, '*'); } catch (err) {}
            }
            
            window.addEventListener('message', function(e) {
                var d = e.data || {};
                if (d && d.type === 'doxii-hover-enable') enable();
                else if (d && d.type === 'doxii-hover-disable') disable();
            });
        }
        
        // Handle initialization messages
        window.addEventListener('message', function(e) {
            try {
                var d = e.data || {};
                if (d && d.type === 'doxii-nav') {
                    if (d.action === 'back') history.back();
                    else if (d.action === 'forward') history.forward();
                    else if (d.action === 'reload') location.reload();
                } else if (d && d.type === 'doxii-init-hover') {
                    initDoxiiHoverSystem();
                }
            } catch (err) {}
        });
        
        // Initialize immediately and on load
        captureConsoleErrors(); // Initialize error capture immediately

        // Initialize on load with multiple timing strategies for Lit components
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                postRoute();
                captureConsoleErrors(); // Re-initialize in case something reset it
                setTimeout(initDoxiiHoverSystem, 100); // Delay to ensure components are loaded

                // Additional discovery timing for dynamic components
                setTimeout(function() {
                    if (window.doxiiHoverSystemInitialized && window.doxiiInjectDataMeta) {
                        // Re-inject data-meta for any newly loaded components
                        var enabled = document.querySelector('[data-meta]') !== null;
                        if (enabled) {
                            window.doxiiInjectDataMeta();
                        }
                    }
                }, 500);
            });
        } else {
            postRoute();
            setTimeout(initDoxiiHoverSystem, 100);

            // Additional discovery for already loaded page
            setTimeout(function() {
                if (window.doxiiHoverSystemInitialized && window.doxiiInjectDataMeta) {
                    var enabled = document.querySelector('[data-meta]') !== null;
                    if (enabled) {
                        window.doxiiInjectDataMeta();
                    }
                }
            }, 500);
        }
    })();
    </script>
    """


@router.get("/{chat_id}")
async def serve_chat_file(chat_id: str, path: str = Query(default="index.html")):
    """Serve files from chat directory using query parameter"""
    # Default to index.html for Lit projects (no build step required)
    if not path or path.endswith("/"):
        default_path = "index.html"
        if path:
            path = path + "index.html"
        else:
            path = default_path

    # For SPA routes (paths that start with / and don't have file extensions),
    # serve index.html instead of treating them as file paths
    if path.startswith("/") and "." not in os.path.basename(path):
        # This is likely a SPA route like /product/101, serve index.html
        chat_root = chat_service._canonicalize(os.path.join(chat_service.chats_dir, chat_id))
        index_path = chat_service._canonicalize(os.path.join(chat_root, "index.html"))
        
        if os.path.exists(index_path):
            # Serve index.html for SPA routing
            try:
                with open(index_path, "r", encoding="utf-8", errors="replace") as f:
                    html = f.read()
                
                # Set base path for SPA
                base_path = f"/preview/{chat_id}/"
                
                # Inject Visual Edit system and base tag
                visual_edit_script = _get_visual_edit_script(chat_id)
                
                if "<head" in html:
                    html = html.replace("<head>", f'<head><base href="{base_path}">{visual_edit_script}', 1)
                else:
                    html = f'<base href="{base_path}">{visual_edit_script}' + html
                
                # Add cache-busting headers for hard refresh
                response = HTMLResponse(content=html, media_type="text/html")
                response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
                response.headers["Pragma"] = "no-cache"
                response.headers["Expires"] = "0"
                return response
            except Exception:
                pass

    # Handle regular file paths
    # Remove leading slash for file system operations
    if path.startswith("/"):
        path = path.lstrip("/")

    # Resolve path under chat root safely
    chat_root = chat_service._canonicalize(os.path.join(chat_service.chats_dir, chat_id))
    abs_path = chat_service._canonicalize(os.path.join(chat_root, path))

    try:
        chat_service._ensure_within_chat_root_or_raise(chat_id, abs_path)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    # If index.html doesn't exist at root, try dist/ or public/ as fallback
    if not os.path.exists(abs_path) and path == "index.html":
        # Try dist/index.html for legacy React builds (compatibility)
        dist_fallback = "dist/index.html"
        dist_abs = chat_service._canonicalize(os.path.join(chat_root, dist_fallback))
        if os.path.exists(dist_abs):
            abs_path = dist_abs
        else:
            # Try public/index.html as final fallback
            fallback_path = "public/index.html"
            abs_path = chat_service._canonicalize(os.path.join(chat_root, fallback_path))

    if not os.path.exists(abs_path) or os.path.isdir(abs_path):
        # Fallback: if request points at dist/* but dist doesn't exist (Lit projects), try without 'dist/'
        if path.startswith("dist/"):
            alt_rel = path[len("dist/") :]
            alt_abs = chat_service._canonicalize(os.path.join(chat_root, alt_rel))
            try:
                chat_service._ensure_within_chat_root_or_raise(chat_id, alt_abs)
                if os.path.exists(alt_abs) and not os.path.isdir(alt_abs):
                    media_type, _ = mimetypes.guess_type(alt_abs)
                    return FileResponse(alt_abs, media_type=media_type or "application/octet-stream")
            except Exception:
                pass
        # Send a custom error message to the iframe for 404 handling
        response = HTMLResponse(
            content="""
            <html>
                <head><title>404 - File not found</title></head>
                <body>
                    <script>
                        if (window.parent && window.parent !== window) {
                            window.parent.postMessage({
                                type: 'doxii-error',
                                status: 404,
                                message: 'File not found'
                            }, '*');
                        }
                    </script>
                    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                        <h1>404 - File Not Found</h1>
                        <p>The requested file could not be found.</p>
                    </div>
                </body>
            </html>
            """,
            status_code=404
        )
        return response

    # For HTML files, inject base path and Visual Edit system for Lit projects
    media_type, _ = mimetypes.guess_type(abs_path)
    if (media_type or "").startswith("text/html"):
        try:
            with open(abs_path, "r", encoding="utf-8", errors="replace") as f:
                html = f.read()

            # For Lit projects, always inject base path for relative links
            dir_path = os.path.dirname(path)
            if dir_path:
                base_path = f"/preview/{chat_id}/{dir_path}/"
            else:
                # Root documents: set base to trailing-slash path so relative asset URLs resolve naturally
                base_path = f"/preview/{chat_id}/"
            
            # Inject Visual Edit system and base tag
            visual_edit_script = _get_visual_edit_script(chat_id)
            
            if "<head" in html:
                html = html.replace("<head>", f'<head><base href="{base_path}">{visual_edit_script}', 1)
            else:
                html = f'<base href="{base_path}">{visual_edit_script}' + html
            
            # Add cache-busting headers for hard refresh
            response = HTMLResponse(content=html, media_type="text/html")
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
            return response
        except Exception:
            pass
    
    # Add cache-busting headers for all file responses
    response = FileResponse(abs_path, media_type=media_type or "text/plain")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@router.get("/{chat_id}/{path:path}")
async def serve_chat_file_path(chat_id: str, path: str):
    """Serve files via path segment, enabling natural relative URL resolution in iframes."""
    # Normalize and resolve under chat root
    chat_root = chat_service._canonicalize(os.path.join(chat_service.chats_dir, chat_id))
    # Prevent leading slashes from escaping chat root
    rel_path = path.lstrip("/\\")
    abs_path = chat_service._canonicalize(os.path.join(chat_root, rel_path))
    try:
        chat_service._ensure_within_chat_root_or_raise(chat_id, abs_path)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    if not os.path.exists(abs_path) or os.path.isdir(abs_path):
        # Fallback: if request points at dist/* but dist doesn't exist (Lit projects), try without 'dist/'
        if rel_path.startswith("dist/"):
            alt_rel = rel_path[len("dist/") :]
            alt_abs = chat_service._canonicalize(os.path.join(chat_root, alt_rel))
            try:
                chat_service._ensure_within_chat_root_or_raise(chat_id, alt_abs)
                if os.path.exists(alt_abs) and not os.path.isdir(alt_abs):
                    media_type, _ = mimetypes.guess_type(alt_abs)
                    return FileResponse(alt_abs, media_type=media_type or "application/octet-stream")
            except Exception:
                pass
        
        # SPA fallback: if the path doesn't exist and doesn't have a file extension,
        # it's likely a SPA route, so serve index.html instead
        if '.' not in os.path.basename(rel_path):
            index_path = chat_service._canonicalize(os.path.join(chat_root, "index.html"))
            if os.path.exists(index_path):
                # Serve index.html for SPA routing
                try:
                    with open(index_path, "r", encoding="utf-8", errors="replace") as f:
                        html = f.read()
                    
                    # Set base path for SPA
                    base_path = f"/preview/{chat_id}/"
                    
                    # Inject Visual Edit system and base tag
                    visual_edit_script = _get_visual_edit_script(chat_id)
                    
                    if "<head" in html:
                        html = html.replace("<head>", f'<head><base href="{base_path}">{visual_edit_script}', 1)
                    else:
                        html = f'<base href="{base_path}">{visual_edit_script}' + html
                    
                    # Add cache-busting headers for hard refresh
                    response = HTMLResponse(content=html, media_type="text/html")
                    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
                    response.headers["Pragma"] = "no-cache"
                    response.headers["Expires"] = "0"
                    return response
                except Exception:
                    pass
        
        # Send a custom error message to the iframe for 404 handling
        response = HTMLResponse(
            content="""
            <html>
                <head><title>404 - File not found</title></head>
                <body>
                    <script>
                        if (window.parent && window.parent !== window) {
                            window.parent.postMessage({
                                type: 'doxii-error',
                                status: 404,
                                message: 'File not found'
                            }, '*');
                        }
                    </script>
                    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                        <h1>404 - File Not Found</h1>
                        <p>The requested file could not be found.</p>
                    </div>
                </body>
            </html>
            """,
            status_code=404
        )
        return response

    media_type, _ = mimetypes.guess_type(abs_path)
    if (media_type or "").startswith("text/html"):
        # For HTML served via nested path, set base to its directory and inject Visual Edit
        try:
            with open(abs_path, "r", encoding="utf-8", errors="replace") as f:
                html = f.read()
            dir_path = os.path.dirname(rel_path)
            base_path = f"/preview/{chat_id}/{dir_path}/" if dir_path else f"/preview/{chat_id}/"
            
            # Inject Visual Edit system and base tag
            visual_edit_script = _get_visual_edit_script(chat_id)
            
            if "<head" in html:
                html = html.replace("<head>", f'<head><base href="{base_path}">{visual_edit_script}', 1)
            else:
                html = f'<base href="{base_path}">{visual_edit_script}' + html
            
            # Add cache-busting headers for hard refresh
            response = HTMLResponse(content=html, media_type="text/html")
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
            return response
        except Exception:
            pass
    
    # Add cache-busting headers for all file responses
    response = FileResponse(abs_path, media_type=media_type or "application/octet-stream")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response
