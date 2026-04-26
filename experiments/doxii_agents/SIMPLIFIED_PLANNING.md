# Simplified Planning System - Homepage Builder

## Summary

The Homepage Builder now uses **ONLY Feature Planning Tools** for a simpler, more focused workflow. Task planning tools have been removed to reduce complexity.

## Why This Change?

### Problem with Dual Planning (Before)
- **2 planning layers**: Features (HLD) + Tasks (LLD)
- **More tool calls**: ~15-20 planning calls per homepage
- **Added complexity**: Agents had to manage hierarchical planning
- **Overkill for homepage**: Creating 1 page doesn't need nested task breakdowns

### Solution: Feature-Only Planning (After)
- **1 planning layer**: Features only
- **Fewer tool calls**: ~10-12 planning calls per homepage
- **Simpler workflow**: Define section → Implement → Mark complete
- **Perfect for homepage**: Each section is straightforward enough to implement directly

## Architecture Decision

### Homepage Builder Scope
- Creates **ONE page** (homepage) with 5-7 sections
- Each section is relatively simple:
  - Hero: Search library → Use/customize or generate
  - Products: Search library → Use/customize or generate
  - Categories: Generate grid/cards
  - Newsletter: Simple form
  - Trust: Badges/testimonials

### Why Feature Planning is Sufficient
1. **Built-in task estimation**: Features already have `estimated_tasks` field
2. **Simple sections**: Homepage sections don't need 5-8 sub-tasks each
3. **Direct implementation**: "Build hero section" is clear enough without breaking down into:
   - Search library
   - Create component
   - Add styling
   - Add content
   - Validate

4. **Faster execution**: Less planning overhead = faster homepage generation

## New Workflow (3 Phases)

### Phase 1: Planning
```python
# Define homepage sections (one feature per section)
write_features([
    FeatureInput(id="f1", name="Hero Section", ...),
    FeatureInput(id="f2", name="Featured Products", ...),
    FeatureInput(id="f3", name="Categories Grid", ...),
    FeatureInput(id="f4", name="Newsletter Signup", ...),
    FeatureInput(id="f5", name="Trust Section", ...),
])
```

### Phase 2: Implementation Loop
```python
while count_features(status="pending") > 0:
    # Get next section
    section = get_features(status="pending")[0]
    
    # Mark in progress
    update_feature_status([{"feature_id": section.id, "status": "in_progress"}])
    
    # Implement section (all in one go)
    # 1. Search component library
    # 2. Use library component or generate custom
    # 3. Customize styling/content
    # 4. Validate with ESLint
    # 5. Fix any errors
    
    # Mark completed
    update_feature_status([{"feature_id": section.id, "status": "completed"}])
```

### Phase 3: Validation
- Run full ESLint validation
- Check structure
- Verify products data
- Ensure all sections complete

## Tools Available

### Feature Planning Tools (ONLY)
- ✅ `write_features(features)` - Define homepage sections
- ✅ `update_feature_status(updates)` - Track progress
- ✅ `count_features(status)` - Check remaining work
- ✅ `get_features(filter_status)` - Retrieve sections
- ✅ `get_feature_progress()` - Overall progress

### Task Planning Tools (REMOVED)
- ❌ `write_tasks()` - No longer available
- ❌ `update_task_status()` - No longer available
- ❌ `get_tasks()` - No longer available
- ❌ `clear_tasks()` - No longer available

## Benefits

### 1. Simpler Mental Model
**Before**: Features → Tasks → Implementation
**After**: Features → Implementation

### 2. Fewer Tool Calls
**Before**: 
- 1 x `write_features` (7 sections)
- 7 x `write_tasks` (5-8 tasks each = ~45 tasks)
- ~45 x `update_task_status` (mark complete)
- 7 x `update_feature_status` (mark complete)
- 7 x `clear_tasks` (cleanup)
- **Total: ~67 planning tool calls**

**After**:
- 1 x `write_features` (7 sections)
- 7 x `update_feature_status` (mark in_progress)
- 7 x `update_feature_status` (mark complete)
- **Total: ~15 planning tool calls**

### 3. Faster Execution
- 52 fewer tool calls = ~2-3 minutes saved
- Simpler logic = fewer potential errors
- More focus on actual implementation

### 4. Better for Homepage Scope
- Homepage sections are straightforward
- Don't need nested breakdowns
- Feature name clearly describes what to build

## What About Complex Features?

For the rare complex section that needs breakdown:
1. **Use comments in code**: Add TODO comments as you implement
2. **Mental breakdown**: Agent can think through steps without tool calls
3. **Incremental implementation**: Build piece by piece, validate as you go

Example:
```python
# Agent thinks: "Hero section needs:"
# 1. Search library for hero component
# 2. If found: save and customize styling
# 3. If not: generate custom component
# 4. Add content and images
# 5. Validate with ESLint

# Then implements all steps directly without separate task tracking
```

## Comparison: Architect V2 vs Homepage Builder

### Architect V2 (Full E-commerce Site)
- **Scope**: 12-15 pages + infrastructure
- **Complexity**: High (auth, checkout, admin, etc.)
- **Planning**: Dual (Features + Tasks)
- **Why**: Complex features need breakdown
- **Example**: Checkout flow has 8+ sub-tasks

### Homepage Builder (Single Page)
- **Scope**: 1 page (homepage only)
- **Complexity**: Low-Medium (5-7 sections)
- **Planning**: Single (Features only)
- **Why**: Simple sections don't need breakdown
- **Example**: Hero section is straightforward

## Changes Made

### 1. Removed Task Planning Import
```python
# Before
from .tools.task_planning_tools import TASK_PLANNING_TOOLS

# After
# (removed)
```

### 2. Updated Instructions
- Removed all references to task planning
- Simplified workflow from 4 phases to 3 phases
- Removed LLD (Low-Level Design) concepts
- Updated examples to show direct implementation

### 3. Removed Tools from Agent
```python
# Before
tools=FILE_TOOLS + COMPONENT_LIBRARY_TOOLS + FEATURE_PLANNING_TOOLS + 
      TASK_PLANNING_TOOLS + VALIDATION_TOOLS + ESLINT_TOOLS + DOC_TOOLS

# After
tools=FILE_TOOLS + COMPONENT_LIBRARY_TOOLS + FEATURE_PLANNING_TOOLS + 
      VALIDATION_TOOLS + ESLINT_TOOLS + DOC_TOOLS
```

### 4. Fixed F-String Formatting
- Escaped all JSON examples with double braces `{{...}}`
- Prevents Python f-string formatting errors

## Testing

```bash
# Verify import works
cd experiments
python -c "from doxii_agents.homepage_builder import create_homepage_builder_agent; print('✅ Success')"
```

## Migration Notes

If you have existing code that uses task planning tools with the homepage builder:
1. Remove all `write_tasks()` calls
2. Remove all `update_task_status()` calls
3. Remove all `clear_tasks()` calls
4. Implement features directly without task breakdown

## Conclusion

The simplified planning system makes the Homepage Builder:
- ✅ **Faster**: Fewer tool calls = quicker execution
- ✅ **Simpler**: One planning layer instead of two
- ✅ **Clearer**: Feature name describes what to build
- ✅ **Appropriate**: Matches the scope (1 page vs full site)

For full e-commerce sites with complex features, Architect V2 still uses dual planning. But for focused single-page generation, feature-only planning is the right choice.

