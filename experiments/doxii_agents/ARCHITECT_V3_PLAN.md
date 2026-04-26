# Architect V3 - Optimized E-commerce Store Generator

## Executive Summary

**Goal**: Reduce e-commerce store generation time from 48-58 min to 18-28 min (55-65% improvement)

**Key Innovations**:
1. ✅ Eliminate PLAN.md file-based tracking (saves 12 min)
2. ✅ Todo-only state management (saves 6 min)
3. ✅ Documentation externalization (saves 8-10 min)
4. ✅ Batch execution with doc caching (saves 10-15 min)
5. ✅ Tiered validation strategy (saves 4-6 min)

**Expected Runtime**: 18-28 minutes (60% faster than V2)

---

## Three-Phase Workflow

### Phase 1: PLAN (5-8 min)

**Objective**: Create comprehensive, executable task list without file overhead

**Steps**:
1. **Analyze Business Requirements** (2 min)
   - Parse user request for business type, style, features
   - Identify unique selling propositions
   - Determine required components and pages

2. **Create Detailed Todos** (3-5 min)
   - Generate 15-30 tasks (typically 20-25)
   - Each todo contains:
     ```python
     {
         "id": "unique-task-id",
         "content": "Concise imperative description",
         "activeForm": "Present continuous form",
         "status": "pending",
         "category": "setup|component|page|integration|validation",
         "details": {
             "extends": "base-component.js",  # What to extend
             "uses": ["productsStore", "cartStore"],  # APIs to use
             "files": ["components/product-card.js"],  # Files to create
             "docs_needed": [
                 "components/product-components.md",
                 "infrastructure/state-management.md"
             ],
             "scaffold_refs": [
                 "scaffold_infrastructure/components/base-component.js"
             ],
             "validation": "ESLint + manual test",
             "dependencies": ["setup-state"]  # Task IDs this depends on
         }
     }
     ```

3. **Group into Batches** (1 min)
   - Organize by dependency + type
   - Typical batches:
     ```
     Batch 1: Infrastructure (2-3 tasks)
     Batch 2: Base Components (4-6 tasks)
     Batch 3: Product Components (4-6 tasks)
     Batch 4: Pages (5-7 tasks)
     Batch 5: Shopping Flow (3-4 tasks)
     Batch 6: Validation (2-3 tasks)
     ```

4. **Store in Todo List Only**
   - No PLAN.md creation
   - No file I/O overhead
   - Single source of truth

**Output**:
- 15-30 detailed todos in memory
- Grouped into 5-7 batches
- Ready for execution

---

### Phase 2: EXECUTE (12-20 min)

**Objective**: Implement all features efficiently using batch processing

**Batch Execution Loop**:

```
FOR EACH BATCH (5-7 iterations):

    1. PRE-LOAD DOCUMENTATION (30-60 sec per batch)
       ├─ Collect all docs_needed from batch tasks
       ├─ Collect all scaffold_refs from batch tasks
       ├─ Read ALL docs in single I/O burst
       └─ Cache in BatchContext

    2. FOR EACH TASK in batch (2-4 min per task):
       ├─ Mark task as in_progress
       ├─ Implement using cached docs (no file reads)
       ├─ Quick validation:
       │   ├─ File exists
       │   ├─ Imports are valid paths
       │   ├─ Syntax parses (no ESLint yet)
       │   └─ IF fails → Fix immediately, re-check
       ├─ Mark task as completed
       └─ Move to next task

    3. MOVE TO NEXT BATCH
       └─ Clear doc cache, load new docs
```

**Quick Validation Criteria**:
```python
quick_check = {
    "file_created": verify_file_exists(file_path),
    "imports_valid": check_import_paths_exist(file_content),
    "syntax_valid": parse_js_syntax(file_content),  # No linting
    "skip_eslint": True  # Save for Phase 3
}
```

**Error Handling**:
- **IF quick_check fails**:
  1. STOP (don't mark completed)
  2. Fix error immediately
  3. Re-run quick_check
  4. Continue only when passes
- **IF quick_check passes**: Continue to next task

**Key Optimization**: Documentation cached per batch, not re-read per task

**Output**:
- All 15-30 tasks implemented
- All marked completed
- Ready for validation

---

### Phase 3: VALIDATE (3-5 min)

**Objective**: Ensure 100% project completeness and quality

**Steps**:

1. **Run Full ESLint Validation** (1-2 min)
   ```python
   result = validate_project_with_eslint(context)

   if result.error_count > 0:
       # Add fix todos dynamically
       for error in result.errors:
           add_fix_todo(error)
   ```

2. **Fix All Errors** (if needed) (1-2 min)
   ```python
   while error_count > 0:
       # Fix errors from dynamically added todos
       fix_all_errors()
       # Re-run ESLint
       result = validate_project_with_eslint(context)
       error_count = result.error_count
   ```

3. **Verify Project Structure** (30 sec)
   ```python
   required_files = [
       "index.html",
       "assets/app.js",
       "assets/state.js",
       "components/*.js",
       "pages/*.js"
   ]
   verify_all_files_exist(required_files)
   ```

4. **Verify Product Data** (30 sec)
   ```python
   state = read_file("assets/state.js")
   products = parse_products(state)
   assert len(products) >= 12
   assert all_products_have_required_fields(products)
   ```

5. **Final Completion Check** (30 sec)
   ```python
   checklist = {
       "all_todos_completed": all(t.status == "completed" for t in todos),
       "eslint_passed": error_count == 0,
       "structure_valid": all_files_exist,
       "products_valid": len(products) >= 12
   }

   assert all(checklist.values())
   ```

**Output**:
- ✅ All ESLint errors fixed
- ✅ All files present
- ✅ All products valid
- ✅ Project ready for deployment

---

## Documentation Structure

### Folder Organization

```
experiments/doxii_agents/
├── architect_v3.py (new optimized agent)
├── docs/
│   ├── INDEX.md (documentation map)
│   ├── components/
│   │   ├── base-component-guide.md
│   │   ├── header-components.md
│   │   ├── product-components.md
│   │   ├── footer-components.md
│   │   ├── navigation-components.md
│   │   └── form-components.md
│   ├── pages/
│   │   ├── page-structure.md
│   │   ├── routing-integration.md
│   │   └── state-integration.md
│   ├── infrastructure/
│   │   ├── state-management.md
│   │   ├── cart-api.md
│   │   ├── utils-api.md
│   │   ├── router-api.md
│   │   ├── wishlist-api.md
│   │   └── product-filters-api.md
│   └── patterns/
│       ├── mobile-responsive.md
│       ├── dark-mode.md
│       ├── validation.md
│       ├── animations.md
│       └── images-epicsum.md
└── tools/
    ├── file_tools.py
    ├── todo_tools.py
    ├── validation_tools.py
    ├── eslint_tools.py
    └── doc_tools.py (NEW - documentation management)
```

### Documentation INDEX.md

Maps documentation categories to specific files:

```markdown
# Documentation Index

## Components
- base-component: docs/components/base-component-guide.md
- headers: docs/components/header-components.md
- products: docs/components/product-components.md
- footers: docs/components/footer-components.md
- navigation: docs/components/navigation-components.md
- forms: docs/components/form-components.md

## Pages
- structure: docs/pages/page-structure.md
- routing: docs/pages/routing-integration.md
- state: docs/pages/state-integration.md

## Infrastructure
- state: docs/infrastructure/state-management.md
- cart: docs/infrastructure/cart-api.md
- utils: docs/infrastructure/utils-api.md
- router: docs/infrastructure/router-api.md
- wishlist: docs/infrastructure/wishlist-api.md
- filters: docs/infrastructure/product-filters-api.md

## Patterns
- mobile: docs/patterns/mobile-responsive.md
- dark-mode: docs/patterns/dark-mode.md
- validation: docs/patterns/validation.md
- animations: docs/patterns/animations.md
- images: docs/patterns/images-epicsum.md
```

---

## New Tool: doc_tools.py

### Purpose
Efficiently load and cache documentation during batch execution

### Functions

```python
@function_tool
async def load_documentation(
    ctx: RunContextWrapper[DoxiiContext],
    doc_keys: List[str]
) -> str:
    """
    Load multiple documentation files in a single call.

    Args:
        doc_keys: List of documentation keys from INDEX.md
                 (e.g., ["base-component", "state", "mobile"])

    Returns:
        JSON with loaded documentation content
    """

@function_tool
async def get_scaffold_file(
    ctx: RunContextWrapper[DoxiiContext],
    file_path: str
) -> str:
    """
    Read scaffold infrastructure file for reference.

    Args:
        file_path: Path relative to scaffold_infrastructure/
                  (e.g., "components/base-component.js")

    Returns:
        File content
    """
```

---

## Simplified Instructions

**Current V2**: 700 lines of instructions
**New V3**: 200-300 lines

### What's Removed
- ❌ Detailed component creation instructions (moved to docs/components/)
- ❌ Detailed API usage examples (moved to docs/infrastructure/)
- ❌ Pattern implementation details (moved to docs/patterns/)
- ❌ PLAN.md management instructions (no longer needed)
- ❌ Redundant warnings and safeguards

### What Remains
- ✅ 3-phase workflow description
- ✅ Todo management rules
- ✅ Batch execution strategy
- ✅ Validation criteria
- ✅ Reference to documentation: "Read docs as needed from docs_needed array"

---

## Performance Comparison

| Metric | V2 (Current) | V3 (New) | Improvement |
|--------|--------------|----------|-------------|
| **Phase 1** | 8-10 min | 5-8 min | 25-30% |
| **Phase 2** | 35-40 min | 12-20 min | 50-65% |
| **Phase 3** | 5-8 min | 3-5 min | 35-40% |
| **TOTAL** | **48-58 min** | **18-28 min** | **~60%** |

### Time Savings Breakdown

| Optimization | Time Saved |
|-------------|------------|
| Eliminate PLAN.md I/O | 12 min |
| Todo-only tracking | 6 min |
| Documentation externalization | 8-10 min |
| Batch doc caching | 8-12 min |
| Tiered validation | 4-6 min |
| **TOTAL SAVINGS** | **38-46 min** |

---

## Implementation Checklist

### Phase 1: Setup
- [x] Create ARCHITECT_V3_PLAN.md
- [ ] Create docs/ folder structure
- [ ] Write INDEX.md
- [ ] Write component documentation
- [ ] Write infrastructure documentation
- [ ] Write patterns documentation
- [ ] Create doc_tools.py

### Phase 2: Implementation
- [ ] Create architect_v3.py
- [ ] Implement Phase 1 (PLAN) logic
- [ ] Implement Phase 2 (EXECUTE) with batching
- [ ] Implement Phase 3 (VALIDATE)
- [ ] Add BatchContext for doc caching

### Phase 3: Testing
- [ ] Create interactive test script
- [ ] Test with sample e-commerce project
- [ ] Measure actual runtime
- [ ] Compare quality vs V2
- [ ] Validate no regressions

---

## Success Criteria

### Performance
- ✅ Total runtime < 30 minutes (target: 18-28 min)
- ✅ Phase 1 < 8 minutes
- ✅ Phase 2 < 20 minutes
- ✅ Phase 3 < 5 minutes

### Quality
- ✅ All features implemented correctly
- ✅ ESLint validation passes (error_count === 0)
- ✅ 12+ products with all required fields
- ✅ Mobile responsive
- ✅ Dark mode works
- ✅ No quality regression vs V2

### Architecture
- ✅ Zero PLAN.md file operations
- ✅ Single source of truth (todo list)
- ✅ Documentation externalized
- ✅ Instructions reduced to 200-300 lines
- ✅ Batch execution with doc caching

---

## Migration Guide (V2 → V3)

### For Orchestrator
```python
# OLD (V2)
from .architect_v2 import create_architect_v2_agent

# NEW (V3)
from .architect_v3 import create_architect_v3_agent

# Usage
architect = create_architect_v3_agent()
```

### For Users
- ✅ Same input format (business requirements)
- ✅ Same output quality (e-commerce store)
- ✅ 60% faster execution
- ✅ Better progress visibility (todo list)

---

## Future Optimizations

### V4 Ideas (Future)
1. **Parallel Component Generation**: Generate independent components in parallel
2. **Template Library**: Pre-built component templates for common patterns
3. **Smart Dependency Detection**: Automatically detect and order dependencies
4. **Incremental Validation**: Validate as you go instead of full batch at end
5. **LLM Caching**: Cache common patterns to reduce token usage

**Potential V4 Runtime**: 10-15 minutes (additional 40-50% improvement)

---

## Appendix: Batch Grouping Examples

### Example 1: Standard E-commerce (25 tasks)

**Batch 1: Infrastructure (3 tasks)**
1. Customize state.js with 12+ products
2. Create app.js with imports
3. Update index.html with branding

**Batch 2: Base Components (5 tasks)**
4. header-minimal.js
5. footer-modern.js
6. nav-hamburger.js
7. theme-toggle.js
8. search-bar.js

**Batch 3: Product Components (6 tasks)**
9. product-card-grid.js
10. product-grid-masonry.js
11. product-filter-sidebar.js
12. product-sort-dropdown.js
13. product-quickview.js
14. product-breadcrumbs.js

**Batch 4: Pages (7 tasks)**
15. page-home.js
16. page-catalog.js
17. page-product.js
18. page-cart.js
19. page-checkout.js
20. page-account.js
21. page-wishlist.js

**Batch 5: Integration (2 tasks)**
22. Wire up routing
23. Add animations (AOS/GSAP)

**Batch 6: Validation (2 tasks)**
24. ESLint validation + fixes
25. Final QA check

---

## Notes

- This plan is based on analysis of V2's 48-min runtime
- Estimates assume standard e-commerce store (catalog, cart, checkout)
- Actual runtime may vary based on complexity
- Documentation on demand is the biggest performance win
- Batch execution prevents context switching overhead
