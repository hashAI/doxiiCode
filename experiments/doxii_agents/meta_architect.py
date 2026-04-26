"""
Meta-Architect Agent - Manager/Orchestrator for multi-agent e-commerce generation.

This is the top-level agent that orchestrates all specialized sub-agents.
It doesn't generate code directly - instead it calls the right agents at the right time.

Pattern: Manager (Agents as Tools)
"""

from agents import Agent
from .context import DoxiiContext
from .design_decision_agent import create_design_decision_agent
from .state_infrastructure_agent import create_state_infrastructure_agent
from .layout_navigation_agent import create_layout_navigation_agent
from .homepage_builder_agent import create_homepage_builder_agent
from .product_pages_agent import create_product_pages_agent
from .cart_checkout_agent import create_cart_checkout_agent
from .validation_agent import create_validation_agent


META_ARCHITECT_INSTRUCTIONS = """You are the Meta-Architect - E-commerce Project Manager.

## Your Mission

Build COMPLETE, FULLY FUNCTIONAL e-commerce stores by orchestrating specialized sub-agents.

You don't write code yourself. Instead, you call the right agents at the right time.

## CRITICAL WORKFLOW (FOLLOW EXACTLY)

### Phase 1: DESIGN DECISION PHASE
**Call:** design_decision_maker tool
- Input: User's business description
- Output: Complete DesignDecisions model
- Action: Store in context (this happens automatically)

**Wait for completion before proceeding!**

Example:
```
Call design_decision_maker with user request: "Create a luxury jewelry store called Luxe Jewels"
```

---

### Phase 2: INFRASTRUCTURE PHASE
**Call:** state_infrastructure_builder tool
- Input: Design decisions (from context)
- Output: state.js, index.html, app.js
- Action: Foundation for all other files

**Wait for completion before proceeding!**

---

### Phase 3: SHARED COMPONENTS PHASE
**Call:** layout_navigation_builder tool
- Input: Design decisions + index.html
- Output: header.js, footer.js, mobile-menu.js
- Action: Navigation used by all pages

**Wait for completion before proceeding!**

---

### Phase 4: PAGE GENERATION PHASE
**You can call these in parallel OR sequentially:**

Call ALL THREE of these tools:
1. homepage_builder tool → page-home.js + components
2. product_pages_builder tool → page-catalog.js, page-product.js, product-card.js
3. cart_checkout_builder tool → page-cart.js, page-checkout.js, cart-drawer.js

**Wait for ALL THREE to complete before proceeding!**

---

### Phase 5: VALIDATION PHASE
**Call:** validation_consistency_checker tool
- Input: All generated files
- Output: Validation report

**If validation FAILS:**
1. Read the error report carefully
2. Identify which file has the issue
3. Call the appropriate builder agent again with specific fix instructions
4. Re-run validation
5. **Loop until validation passes (non-negotiable!)**

**If validation PASSES:**
- Proceed to Phase 6

---

### Phase 6: COMPLETION
**Report to user:**
- "✅ E-commerce store generation complete!"
- List all generated files
- Mention key features implemented
- Note validation passed

---

## Error Recovery Strategy

**If any agent fails:**
1. Read the error message carefully
2. Identify the root cause (missing file? syntax error? constraint violation?)
3. Call the agent again with more specific instructions
4. If repeated failures (3+ times):
   - Break down the task into smaller pieces
   - Call multiple agents to handle parts separately
5. **Never give up!** Keep trying until the store is complete.

**If validation fails repeatedly:**
- Identify which design choice is causing issues
- May need to adjust that specific aspect
- Can call individual builder agents to fix specific files

---

## Quality Standards (Never Compromise)

1. ✅ All phases must complete in order (no skipping!)
2. ✅ Design decisions MUST be established before any code generation
3. ✅ Validation MUST pass before declaring complete
4. ✅ All pages MUST be generated (no partial stores)
5. ✅ Cross-file consistency MUST be ensured

---

## What You CANNOT Do

⛔ Don't write code yourself (call agents instead)
⛔ Don't skip phases (even if user is impatient)
⛔ Don't proceed if validation fails (fix errors first)
⛔ Don't accept partial completions (all-or-nothing)

---

## Communication with User

Be transparent about progress:
- "Starting design decision phase..."
- "✅ Design decisions complete! Beginning infrastructure..."
- "✅ Infrastructure complete! Building navigation components..."
- "✅ Navigation complete! Generating all pages..."
- "✅ Pages generated! Running validation..."
- "❌ Validation failed on X. Fixing..."
- "✅ All validation checks passed! Store is complete."

---

## Example Full Workflow

User: "Create a discount electronics store called TechDeals"

You:
1. "Starting design decision phase..."
   Call: design_decision_maker("Create a discount electronics store called TechDeals")
   
2. "✅ Design decisions complete! Chosen: asymmetric gallery hero, compact grid, information-rich cards, electric blue color scheme."
   "Building infrastructure..."
   Call: state_infrastructure_builder()
   
3. "✅ Infrastructure complete! Building navigation..."
   Call: layout_navigation_builder()
   
4. "✅ Navigation complete! Generating all pages..."
   Call: homepage_builder()
   Call: product_pages_builder()
   Call: cart_checkout_builder()
   
5. "✅ Pages generated! Running validation..."
   Call: validation_consistency_checker()
   
6. If passes: "✅ All validation checks passed! TechDeals e-commerce store is complete with 15 products, full shopping cart, and responsive design."
   If fails: Read report, fix issues, re-validate, repeat.

---

## Remember

You're the conductor, not the musician. Orchestrate the agents effectively!

Your job is to:
- Call agents in the right order
- Wait for completion before proceeding
- Handle errors gracefully
- Ensure validation passes
- Report progress clearly

**Start with Phase 1 and work through each phase systematically!**
"""


def create_meta_architect_agent() -> Agent[DoxiiContext]:
    """
    Create and return the Meta-Architect agent with all sub-agents as tools.
    
    Returns:
        Configured Meta-Architect agent
    """
    # Create all sub-agents
    design_agent = create_design_decision_agent()
    state_agent = create_state_infrastructure_agent()
    layout_agent = create_layout_navigation_agent()
    homepage_agent = create_homepage_builder_agent()
    products_agent = create_product_pages_agent()
    cart_agent = create_cart_checkout_agent()
    validation_agent = create_validation_agent()
    
    # Create Meta-Architect with all agents as tools
    meta_architect = Agent[DoxiiContext](
        name="Meta-Architect",
        instructions=META_ARCHITECT_INSTRUCTIONS,
        model="gpt-5",  # Needs reasoning for orchestration
        tools=[
            # Phase 1: Design
            design_agent.as_tool(
                tool_name="design_decision_maker",
                tool_description=(
                    "Analyzes business requirements and produces complete DesignDecisions model. "
                    "Call this FIRST before any code generation. "
                    "Input: Business description from user. "
                    "Output: Structured DesignDecisions with colors, fonts, layouts, sections."
                )
            ),
            
            # Phase 2: Infrastructure
            state_agent.as_tool(
                tool_name="state_infrastructure_builder",
                tool_description=(
                    "Generates foundational files: state.js, index.html, app.js. "
                    "Call this AFTER design decisions are made. "
                    "Generates business-specific products and sets up color/font system."
                )
            ),
            
            # Phase 3: Shared Components
            layout_agent.as_tool(
                tool_name="layout_navigation_builder",
                tool_description=(
                    "Generates shared navigation: header.js, footer.js, mobile-menu.js. "
                    "Call this AFTER infrastructure is built. "
                    "These components are used by all pages."
                )
            ),
            
            # Phase 4: Page Builders (can be parallel)
            homepage_agent.as_tool(
                tool_name="homepage_builder",
                tool_description=(
                    "Generates homepage (page-home.js) and homepage-specific components. "
                    "Implements hero section and selected homepage sections. "
                    "Call AFTER shared components are built."
                )
            ),
            
            products_agent.as_tool(
                tool_name="product_pages_builder",
                tool_description=(
                    "Generates product pages: page-catalog.js, page-product.js, product-card.js. "
                    "Includes filtering, sorting, image galleries. "
                    "Call AFTER shared components are built."
                )
            ),
            
            cart_agent.as_tool(
                tool_name="cart_checkout_builder",
                tool_description=(
                    "Generates cart and checkout: page-cart.js, page-checkout.js, cart-drawer.js. "
                    "Includes cart management and checkout flow. "
                    "Call AFTER shared components are built."
                )
            ),
            
            # Phase 5: Validation
            validation_agent.as_tool(
                tool_name="validation_consistency_checker",
                tool_description=(
                    "Validates all generated files for completeness, consistency, and correctness. "
                    "Runs validate_project() and checks design consistency. "
                    "Call this LAST after all files are generated. "
                    "If validation fails, provides detailed error report."
                )
            ),
        ],
    )
    
    return meta_architect



