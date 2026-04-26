"""Component Library Router - Browse and preview components"""
import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import mimetypes

router = APIRouter(prefix="/api/components", tags=["components"])

# Path to component library
COMPONENT_LIBRARY_PATH = Path(__file__).parent.parent.parent.parent / "component_library"
CATALOG_PATH = COMPONENT_LIBRARY_PATH / "component-catalog.json"
COMPONENTS_PATH = COMPONENT_LIBRARY_PATH / "components"
ASSETS_PATH = COMPONENT_LIBRARY_PATH / "assets"


@router.get("/catalog")
async def get_catalog():
    """Get the full component catalog"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    return JSONResponse(content=catalog)


@router.get("/categories")
async def get_categories():
    """Get list of all component categories"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    return JSONResponse(content=catalog.get('categories', {}))


@router.get("/search")
async def search_components(
    query: str = None,
    category: str = None,
    style: str = None,
    mobile_friendly: bool = None,
    dark_mode_support: bool = None
):
    """Search components with various filters"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    components = catalog['components']
    results = []
    
    for component in components:
        # Category filter
        if category and component.get('category') != category:
            continue
        
        # Mobile friendly filter
        if mobile_friendly is not None and component.get('mobile_friendly') != mobile_friendly:
            continue
        
        # Dark mode filter
        if dark_mode_support is not None and component.get('dark_mode_support') != dark_mode_support:
            continue
        
        # Style filter
        if style:
            style_tags = [tag.lower() for tag in component.get('style_tags', [])]
            if style.lower() not in style_tags:
                continue
        
        # Query search
        if query:
            query_lower = query.lower()
            searchable_text = ' '.join([
                component.get('name', '').lower(),
                component.get('description', '').lower(),
                ' '.join(component.get('search_keywords', [])),
                ' '.join(component.get('features', [])),
                ' '.join(component.get('style_tags', []))
            ])
            
            query_words = query_lower.split()
            score = sum(1 for word in query_words if word in searchable_text)
            
            if score == 0:
                continue
            
            component_copy = component.copy()
            component_copy['relevance_score'] = score
            results.append(component_copy)
        else:
            results.append(component)
    
    # Sort by relevance if query was used
    if query:
        results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
    
    return JSONResponse(content={"results": results, "count": len(results)})


@router.get("/component/{component_id}")
async def get_component_details(component_id: str):
    """Get details for a specific component"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    for component in catalog['components']:
        if component['id'] == component_id:
            return JSONResponse(content=component)
    
    raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")


@router.get("/component/{component_id}/code")
async def get_component_code(component_id: str):
    """Get the source code for a component"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    component = None
    for comp in catalog['components']:
        if comp['id'] == component_id:
            component = comp
            break
    
    if not component:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    
    # Get file path from catalog
    file_path = Path(__file__).parent.parent.parent.parent / component['file_path']
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Component file not found")
    
    with open(file_path, 'r') as f:
        code = f.read()
    
    return JSONResponse(content={"code": code, "file_path": component['file_path']})


@router.get("/preview")
async def get_preview_page():
    """Serve the component preview HTML page"""
    preview_path = COMPONENT_LIBRARY_PATH / "preview.html"
    
    if not preview_path.exists():
        raise HTTPException(status_code=404, detail="Preview page not found")
    
    return FileResponse(preview_path, media_type="text/html")


@router.get("/component-demos.js")
async def get_component_demos():
    """Serve the component demo configurations (legacy support)"""
    demos_path = COMPONENT_LIBRARY_PATH / "component-demos.js"
    
    if not demos_path.exists():
        raise HTTPException(status_code=404, detail="Component demos file not found")
    
    return FileResponse(demos_path, media_type="application/javascript")


@router.get("/component/{component_id}/preview-config")
async def get_component_preview_config(component_id: str):
    """Get the preview configuration for a component"""
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="Component catalog not found")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    component = None
    for comp in catalog['components']:
        if comp['id'] == component_id or comp['element_tag'] == component_id:
            component = comp
            break
    
    if not component:
        raise HTTPException(status_code=404, detail=f"Component '{component_id}' not found")
    
    # Get preview.js path (now in preview/ subdirectory)
    preview_path = component.get('preview_path')
    if not preview_path:
        # Fallback: construct from file_path
        # component_library/components/category/component/component.js
        # -> component_library/components/category/component/preview/preview.js
        file_path = component['file_path']
        base_path = file_path.rsplit('/', 1)[0]  # Remove filename
        preview_path = f"{base_path}/preview/preview.js"
    
    full_preview_path = Path(__file__).parent.parent.parent.parent / preview_path
    
    if not full_preview_path.exists():
        raise HTTPException(status_code=404, detail="Preview configuration not found")
    
    return FileResponse(
        full_preview_path, 
        media_type="application/javascript",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cross-Origin-Resource-Policy": "cross-origin"
        }
    )


@router.get("/assets/{path:path}")
async def serve_asset_file(path: str):
    """Serve asset files (state.js, router.js, utils.js, etc.)"""
    # Security: ensure path is within assets directory
    full_path = (ASSETS_PATH / path).resolve()
    
    if not str(full_path).startswith(str(ASSETS_PATH.resolve())):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not full_path.exists() or full_path.is_dir():
        raise HTTPException(status_code=404, detail="File not found")
    
    media_type, _ = mimetypes.guess_type(str(full_path))
    
    # For JavaScript modules, ensure proper MIME type and CORS headers
    if media_type is None or str(full_path).endswith('.js'):
        media_type = "application/javascript"
    
    return FileResponse(
        full_path, 
        media_type=media_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cross-Origin-Resource-Policy": "cross-origin"
        }
    )


@router.get("/files/{path:path}")
async def serve_component_file(path: str):
    """Serve component files (JS, CSS, etc.)"""
    # Security: ensure path is within component library
    full_path = (COMPONENTS_PATH / path).resolve()
    
    if not str(full_path).startswith(str(COMPONENTS_PATH.resolve())):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not full_path.exists() or full_path.is_dir():
        raise HTTPException(status_code=404, detail="File not found")
    
    media_type, _ = mimetypes.guess_type(str(full_path))
    
    # For JavaScript modules, ensure proper MIME type and CORS headers
    if media_type is None:
        if str(full_path).endswith('.js'):
            media_type = "application/javascript"
        elif str(full_path).endswith('.mjs'):
            media_type = "application/javascript"
        else:
            media_type = "text/plain"
    
    return FileResponse(
        full_path, 
        media_type=media_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cross-Origin-Resource-Policy": "cross-origin"
        }
    )

