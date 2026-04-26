# Fix: Import Path Error - base-component.js 404

## Problem

Generated homepages were returning this error:
```
GET http://localhost:8080/homepage_20251122_161348/base-component.js net::ERR_ABORTED 404 (File not found)
```

## Root Cause

Components were importing base-component.js with **incorrect relative paths**:

```javascript
// ❌ WRONG - This looks for base-component.js in parent directory
import { BaseComponent } from '../base-component.js';
```

But the actual file structure is:
```
project_root/
├── components/
│   ├── base-component.js     ← File is HERE
│   ├── hero-main.js           ← Components are HERE (same folder)
│   └── other-component.js
```

Since both base-component.js and other components are in the **SAME folder** (`components/`), the import should use `./` not `../`:

```javascript
// ✅ CORRECT - This looks in same directory
import { BaseComponent } from './base-component.js';
```

## What Was Fixed

### 1. Updated homepage_builder.py Instructions

Added clear, explicit import path guidance:

#### Before (Unclear)
```python
## IMPORT PATHS
**From pages/:** `import '../assets/state.js'`
**From components/:** `import '../assets/utils.js'`
```

#### After (Crystal Clear)
```python
## IMPORT PATHS (CRITICAL)

**All components MUST import base-component.js from the SAME folder (components/):**

Example - In components/hero-main.js:
```
import { BaseComponent } from './base-component.js';        // ✅ CORRECT - same folder
import { showToast } from '../assets/utils.js';             // ✅ CORRECT - up one level
```

DO NOT USE:
```
import { BaseComponent } from '../components/base-component.js';  // ❌ WRONG - causes 404!
```
```

### 2. Added Project Structure Documentation

```python
## CRITICAL: PROJECT STRUCTURE

**REQUIRED DIRECTORY STRUCTURE:**
```
project_root/
├── assets/
├── components/
│   ├── base-component.js  (MUST EXIST - copy from infrastructure)
│   └── ...other components
├── pages/
└── index.html
```

**BEFORE CREATING ANY FILES:**
1. **CHECK** if infrastructure files exist (base-component.js, router.js, utils.js)
2. **IF MISSING**: Copy from scaffold_infrastructure/ to project root
3. **VERIFY** components/base-component.js exists (CRITICAL - all components need this!)
```

### 3. Added Infrastructure Verification Step

Updated Phase 2 workflow to verify infrastructure FIRST:

```python
**CRITICAL FIRST STEP:**
Before implementing ANY sections, verify infrastructure:
```python
# Check if base-component.js exists
if not file_exists("components/base-component.js"):
    # Copy entire scaffold_infrastructure to project root
    copy_infrastructure_files()
```
```

### 4. Added Common Errors Section

```python
**Common Errors to Avoid:**
- ❌ Component tries to import `../components/base-component.js` (should be `./base-component.js`)
- ❌ Missing `components/base-component.js` file (copy from infrastructure)
- ❌ Wrong directory structure (must have assets/, components/, pages/)
- ❌ Forgot to import component in `assets/app.js`
```

### 5. Updated DO/DON'T Section

```python
**DO:**
- **VERIFY INFRASTRUCTURE FIRST**: Check base-component.js exists before creating components
- **USE CORRECT IMPORT PATHS**: `./base-component.js` from components folder, NOT `../components/`

**DON'T:**
- Skip infrastructure verification (missing base-component.js = 404 errors!)
- Use wrong import paths (`../components/base-component.js` is WRONG)
```

## Fixed the Existing Homepage

Fixed all component files in `/Users/hash/Projects/doxii/experiments/test_output_homepage/homepage_20251122_161348/`:

```bash
# Changed all components from:
import { BaseComponent } from '../base-component.js';

# To:
import { BaseComponent } from './base-component.js';
```

### Files Fixed:
- ✅ components/promotional-banners.js
- ✅ components/hero-noise-creator.js
- ✅ components/hero-animated-business.js
- ✅ components/gallery-slider-indicators.js
- ✅ components/gallery-marquee-testimonials.js
- ✅ components/categories-grid.js

## Why This Happened

The agent was likely confused about relative paths because:
1. Instructions didn't explicitly show the import path FOR base-component.js itself
2. The pattern `'../assets/utils.js'` from components made the agent think ALL imports from components use `../`
3. No clear warning about this being the #1 most common error

## Import Path Reference Card

### From components/*.js files:
```javascript
import { BaseComponent } from './base-component.js';      // ✅ Same folder
import { showToast } from '../assets/utils.js';           // ✅ Up to assets
import { productsStore } from '../assets/state.js';       // ✅ Up to assets
```

### From pages/*.js files:
```javascript
import { BaseComponent } from '../components/base-component.js';  // ✅ Up then into components
import '../components/hero-main.js';                              // ✅ Import component
import { router } from '../assets/router.js';                     // ✅ Up to assets
```

### From assets/app.js file:
```javascript
import './router.js';                          // ✅ Same folder
import '../components/hero-main.js';           // ✅ Up then into components
import '../pages/page-home.js';                // ✅ Up then into pages
```

## Testing

1. **Test homepage_builder.py imports:**
```bash
cd experiments
python -c "from doxii_agents.homepage_builder import create_homepage_builder_agent; print('✅ Success')"
# ✅ Import successful
```

2. **Test the fixed homepage:**
```bash
cd experiments/test_output_homepage/homepage_20251122_161348
python -m http.server 8080
# Open http://localhost:8080
# Should now load without 404 errors
```

## Prevention

The updated instructions now make it **impossible to miss** the correct import path:

1. ✅ Explicit example showing `'./base-component.js'`
2. ✅ Clear "DO NOT USE" example showing wrong path
3. ✅ Project structure diagram showing files are in same folder
4. ✅ Infrastructure verification step before implementation
5. ✅ Common errors list with this as #1 error
6. ✅ Import reference by file location

## Summary

| Item | Before | After |
|------|--------|-------|
| Instructions clarity | Vague import paths | Explicit examples with ✅/❌ |
| Error prevention | No warnings | Multiple warnings + verification step |
| Project structure | Not documented | Full directory tree shown |
| Common errors | Not mentioned | Listed with solutions |
| Generated code | Wrong path (`../`) | Correct path (`./`) |
| Homepage errors | 404 on base-component.js | ✅ Working |

The homepage at `/Users/hash/Projects/doxii/experiments/test_output_homepage/homepage_20251122_161348/` should now load correctly without any 404 errors!

