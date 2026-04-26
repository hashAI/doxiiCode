# Bulk-Only Tools for Architect V2

## Decision: Restrict to Bulk-Only File Tools

**Status:** ✅ Implemented

## Rationale

After analyzing the logs showing 88 tool calls and 631 seconds execution time, we identified that the agent was making many inefficient sequential file operations:

1. **11 sequential file reads** instead of bulk read
2. **Multiple redundant grep operations** 
3. **Individual file edits** instead of batch operations
4. **Redundant file writes**

## Solution

Created `FILE_TOOLS_BULK_ONLY` export that includes:
- ✅ `bulk_read_files()` - Read multiple files at once
- ✅ `bulk_write_files()` - Write multiple files at once  
- ✅ `batch_find_replace()` - Multi-file search/replace
- ✅ `grep_files()` - Find patterns (needed for discovery)
- ✅ `glob_files()` - Find files by pattern
- ✅ `list_directory_tree()` - Directory listing
- ❌ **Removed:** `read_file()`, `write_file()`, `edit_file()`, `delete_file()`, etc.

## Benefits

1. **Forces Efficiency:** Agent cannot make sequential operations - must batch
2. **Prevents Anti-Patterns:** No way to read/write files one-by-one
3. **Clearer Intent:** Bulk operations make the agent's plan more explicit
4. **Better Performance:** Guaranteed batch operations = faster execution

## Trade-offs

**Pros:**
- Guaranteed batch operations
- Prevents inefficient patterns
- Simpler tool set
- Better performance

**Cons:**
- Slightly more verbose for single-file operations (but still efficient)
- Less flexibility (but flexibility was causing inefficiency)

## Implementation

```python
# In file_tools.py
FILE_TOOLS_BULK_ONLY = [
    bulk_write_files,
    bulk_read_files,
    bulk_delete_files,
    batch_find_replace,
    list_directory_tree,
    glob_files,
    grep_files,
]

# In architect_v2.py
from .tools.file_tools import FILE_TOOLS_BULK_ONLY

tools=FILE_TOOLS_BULK_ONLY + TASK_PLANNING_TOOLS + VALIDATION_TOOLS + ESLINT_TOOLS
```

## Updated Instructions

The instructions now explicitly state:
- ⚠️ **Individual file tools are NOT available**
- ⚡ **MUST use bulk operations for all file work**
- Examples updated to use `bulk_write_files()` even for single files
- Examples updated to use `batch_find_replace()` for single-file modifications

## Expected Impact

- **Tool Calls:** Reduced from ~88 to ~60 (32% reduction)
- **Execution Time:** Reduced from ~631s to ~450-540s (25-30% faster)
- **Efficiency:** Guaranteed batch operations prevent sequential anti-patterns

## Future Considerations

If we find legitimate use cases for individual file operations, we can:
1. Add them back selectively
2. Create a hybrid approach with warnings
3. Keep bulk-only but improve bulk tool ergonomics

For now, bulk-only is the right choice for Architect V2's theme customization workflow.



