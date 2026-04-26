# Component Library Integration - Homepage Builder

## Summary

The Homepage Builder agent now has full access to the component library with **31 pre-built components**. The agent will prioritize using existing components before generating custom ones.

## Changes Made

### 1. Import Added (`homepage_builder.py`)
```python
from .tools.component_library_tools import COMPONENT_LIBRARY_TOOLS
```

### 2. Tools Registered
Component library tools are now included in the agent's tool list:
```python
tools=FILE_TOOLS + COMPONENT_LIBRARY_TOOLS + FEATURE_PLANNING_TOOLS + ...
```

### 3. Instructions Updated

#### New Section: "COMPONENT LIBRARY (USE FIRST!)"
- Added comprehensive component library documentation
- Lists all 43+ available components across 11 categories
- Provides clear workflow for component usage

#### Component Usage Workflow:
1. **Search First**: Use `get_component(query)` to find existing components
2. **Use If Found**: Save component code and customize styling only
3. **Generate If Missing**: Only create custom components if library doesn't have a match

#### Key Rules:
- ✅ **DO**: Search library first, customize styling (colors, spacing, fonts)
- ❌ **DON'T**: Modify component behavior, event handlers, or business logic
- Import paths are automatically fixed - no manual corrections needed

### 4. Updated Task Examples
Modified the LLD task breakdown example to include:
- Task for searching component library first
- Task for saving library component or creating custom
- Emphasis on styling customization only (no behavior modification)

## Component Library Features

### Available Components (31 Total)

#### Heroes (8)
- **hero-gradient-ecommerce**: Modern gradient hero with e-commerce focus
- **hero-ai-geometric**: AI/tech themed hero with geometric patterns
- **hero-nav-showcase**: Hero with integrated navigation showcase
- **hero-grid-gradient-network**: Grid-based hero with network effects
- **hero-noise-creator**: Creative hero with noise/texture effects
- **hero-animated-business**: Professional business hero with animations
- **hero-leaders-industry**: Industry leader showcase hero
- **hero-centered-leaders**: Centered layout for leadership/team showcase

#### Product Detail Pages (4)
- **product-detail-elite**: Elegant accordion sections, perfect for furniture/home decor
- **product-detail-fashion**: Comprehensive reviews, tabs, rating distribution for clothing
- **product-detail-sports**: Vertical gallery, shipping calculator for sports equipment
- **product-detail-minimal**: Clean pill-style selectors for luxury watches/jewelry

#### Product Galleries (7)
- **gallery-hover-expand**: Cards that expand on hover
- **gallery-hover-simple**: Simple hover effects for clean galleries
- **gallery-hover-content**: Content reveals on hover
- **gallery-slider-indicators**: Image slider with dot indicators
- **gallery-slider-buttons**: Image slider with prev/next buttons
- **gallery-grid**: Classic grid layout gallery
- **gallery-marquee-testimonials**: Auto-scrolling testimonials marquee

#### Newsletters (5)
- **newsletter-gradient-purple**: Gradient purple background newsletter signup
- **newsletter-modal-simple**: Simple popup modal newsletter form
- **newsletter-dark-simple**: Dark themed newsletter section
- **newsletter-card-email**: Card-style email capture
- **newsletter-hero-cta**: Hero-style newsletter with prominent CTA

#### Features (4)
- **features-card-grid**: Grid of feature cards
- **features-split-image**: Split layout with image and features
- **features-trusted-brands**: Showcase trusted brands/partners
- **features-icon-list**: Icon-based feature list

#### About (3)
- **about-grid-features**: About section with grid layout
- **about-split-features**: Split layout about section
- **about-video-content**: About section with video embed

### Built-in Features
- ✅ Automatic import path fixing (no manual corrections needed)
- ✅ Production-ready, tested components
- ✅ Mobile-friendly and responsive
- ✅ Dark mode support
- ✅ Lit Web Components with Tailwind CSS
- ✅ Proper dependency tracking

## Usage Example

```python
# Agent will now automatically:
# 1. Search for hero component
result = get_component(ctx, "gradient hero")  # Returns hero-gradient-ecommerce

# 2. Search for newsletter
result = get_component(ctx, "newsletter modal")  # Returns newsletter-modal-simple

# 3. Search for gallery
result = get_component(ctx, "gallery slider")  # Returns gallery-slider-indicators

# 4. Search for features
result = get_component(ctx, "features grid")  # Returns features-card-grid

# 5. Search for about section
result = get_component(ctx, "about video")  # Returns about-video-content

# 6. If found, use it (customize styling only)
# 7. If not found, generate custom component
```

## Behavior Preservation

### ✅ What CAN Be Modified (Look & Feel):
- Colors and color schemes
- Spacing (padding, margins)
- Typography (fonts, sizes, weights)
- Layout adjustments
- Content and text
- Images and icons

### ❌ What CANNOT Be Modified (Behavior):
- Event handlers (`@click`, `@change`, etc.)
- State management logic
- Business logic (cart operations, wishlist, etc.)
- Component lifecycle methods
- Data flow and prop handling

## Benefits

1. **Faster Development**: Pre-built components save time
2. **Consistency**: All components follow established patterns
3. **Quality**: Production-tested, mobile-friendly components
4. **Maintainability**: Standard components are easier to maintain
5. **Best Practices**: Components follow Lit and Tailwind best practices

## Next Steps

The Homepage Builder agent is now ready to:
1. Search component library before generating custom components
2. Use existing components with appropriate styling customizations
3. Only generate custom components when library doesn't have a match
4. Maintain component behavior while customizing appearance

