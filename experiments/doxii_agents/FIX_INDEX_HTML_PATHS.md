# Fix: index.html Path Issues - assets/app.js Loading Errors

## Problem

Generated homepages sometimes fail to load `assets/app.js` with errors like:
```
GET http://localhost:8080/assets/app.js 404 (Not Found)
```

This happens when the homepage is served from a subdirectory but `index.html` uses absolute paths.

## Root Cause

**Absolute vs Relative Paths in index.html:**

### ❌ Absolute Path (WRONG)
```html
<script type="module" src="/assets/app.js"></script>
```
- Leading `/` makes it absolute from domain root
- Works: `http://localhost:8080/` → looks for `/assets/app.js`
- **FAILS**: `http://localhost:8080/homepage_xyz/` → still looks for `/assets/app.js` (wrong!)

### ✅ Relative Path (CORRECT)
```html
<script type="module" src="./assets/app.js"></script>
```
- `./` makes it relative to current directory
- Works: `http://localhost:8080/` → looks for `./assets/app.js`
- Works: `http://localhost:8080/homepage_xyz/` → looks for `./assets/app.js` (correct!)

## What Was Fixed

### 1. Updated homepage_builder.py Instructions

Added dedicated section about index.html requirements:

```python
## INDEX.HTML REQUIREMENTS (CRITICAL)

**ALWAYS use relative paths in index.html:**

```html
<!-- ✅ CORRECT - Relative path with ./ -->
<script type="module" src="./assets/app.js"></script>

<!-- ❌ WRONG - Absolute path with / (breaks in subdirectories) -->
<script type="module" src="/assets/app.js"></script>
```

**Why relative paths matter:**
- Absolute path `/assets/app.js` only works at `http://localhost:8080/`
- Fails in subdirectories like `http://localhost:8080/homepage_xyz/`
- Relative path `./assets/app.js` works everywhere
```

### 2. Updated Project Structure Documentation

Added to MUST HAVE section:
```python
- index.html - Customize for brand (use RELATIVE paths: ./assets/app.js)
```

### 3. Updated Common Errors List

Added to common errors:
```python
- ❌ index.html uses absolute path `/assets/app.js` (should be `./assets/app.js`)
```

### 4. Updated DO/DON'T Section

```python
**DO:**
- **USE RELATIVE PATHS IN HTML**: `./assets/app.js` NOT `/assets/app.js`

**DON'T:**
- Use absolute paths in index.html (`/assets/app.js` is WRONG)
```

### 5. Added Complete index.html Template

Provided a complete working template showing best practices:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{STORE_NAME}}</title>
    <meta name="description" content="{{DESCRIPTION}}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Optional: Tailwind config -->
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: { /* brand colors */ }
                }
            }
        }
    </script>
</head>
<body>
    <div id="app"></div>
    
    <!-- ✅ MUST use relative path: ./assets/app.js -->
    <script type="module" src="./assets/app.js"></script>
</body>
</html>
```

## Fixed Existing Homepages

### Homepage 1: homepage_20251122_161348
**Before:**
```html
<script type="module" src="assets/app.js"></script>
```

**After:**
```html
<script type="module" src="./assets/app.js"></script>
```

### Homepage 2: homepage_20251122_171019
**Before:**
```html
<script type="module" src="/assets/app.js"></script>
```

**After:**
```html
<script type="module" src="./assets/app.js"></script>
```

## Path Types Explained

### Three Types of Paths

| Path Type | Example | Starts From | Use Case |
|-----------|---------|-------------|----------|
| **Absolute** | `/assets/app.js` | Domain root | ❌ Never use in index.html |
| **Relative (explicit)** | `./assets/app.js` | Current directory | ✅ Perfect for index.html |
| **Relative (implicit)** | `assets/app.js` | Current directory | ⚠️ Works but be explicit |

### Examples

**Scenario 1: At Root**
- URL: `http://localhost:8080/`
- File location: `/index.html`
- All three work, but `./` is clearest

**Scenario 2: In Subdirectory**
- URL: `http://localhost:8080/homepage_20251122_171019/`
- File location: `/homepage_20251122_171019/index.html`
- **ONLY** `./assets/app.js` works correctly
- `/assets/app.js` looks at root (WRONG)

## Complete Path Reference

### In index.html:
```html
<!-- ✅ ALWAYS USE THIS -->
<script type="module" src="./assets/app.js"></script>

<!-- ❌ NEVER USE THESE -->
<script type="module" src="/assets/app.js"></script>  <!-- Absolute -->
<script type="module" src="../assets/app.js"></script> <!-- Up one level -->
```

### In JavaScript imports:

**From assets/app.js:**
```javascript
import './router.js';                    // ✅ Same folder
import '../components/hero.js';          // ✅ Up then into components
import '../pages/page-home.js';          // ✅ Up then into pages
```

**From components/*.js:**
```javascript
import { BaseComponent } from './base-component.js';  // ✅ Same folder
import { showToast } from '../assets/utils.js';       // ✅ Up to assets
```

**From pages/*.js:**
```javascript
import { BaseComponent } from '../components/base-component.js';  // ✅ Up then into components
import { productsStore } from '../assets/state.js';               // ✅ Up to assets
```

## Why This Matters

### Development Scenarios

1. **Local Development Server**
   ```bash
   cd homepage_20251122_171019
   python -m http.server 8080
   # URL: http://localhost:8080/
   # Relative path works ✅
   # Absolute path works ✅ (lucky!)
   ```

2. **Nested Directory**
   ```bash
   cd test_output_homepage
   python -m http.server 8080
   # URL: http://localhost:8080/homepage_20251122_171019/
   # Relative path works ✅
   # Absolute path FAILS ❌ (looks at root!)
   ```

3. **Production Deployment**
   - Often deployed to subdirectories: `/demos/store/`, `/v2/homepage/`, etc.
   - Absolute paths break
   - Relative paths always work

## Testing

Test both homepages now work correctly:

```bash
# Test Homepage 1
cd /Users/hash/Projects/doxii/experiments/test_output_homepage/homepage_20251122_161348
python -m http.server 8080
# Open http://localhost:8080/ - should load ✅

# Test Homepage 2
cd /Users/hash/Projects/doxii/experiments/test_output_homepage/homepage_20251122_171019
python -m http.server 8080
# Open http://localhost:8080/ - should load ✅

# Test nested directory scenario
cd /Users/hash/Projects/doxii/experiments/test_output_homepage
python -m http.server 8080
# Open http://localhost:8080/homepage_20251122_171019/ - should load ✅
```

## Prevention Checklist

Future homepages must have:

- ✅ index.html uses `./assets/app.js` (relative path with `./`)
- ✅ No absolute paths starting with `/` in HTML
- ✅ Proper directory structure (assets/, components/, pages/)
- ✅ All JavaScript imports use correct relative paths

## Summary

| Issue | Before | After |
|-------|--------|-------|
| Path type | Absolute `/assets/app.js` | Relative `./assets/app.js` |
| Works at root | ✅ Yes | ✅ Yes |
| Works in subdirectory | ❌ No | ✅ Yes |
| Instructions | Not explicit | Dedicated section |
| Template provided | No | Yes |
| Common errors list | Not mentioned | Listed |
| DO/DON'T | Not mentioned | Explicit rule |

Both existing homepages are now fixed and future generations will use the correct relative paths! 🎉

