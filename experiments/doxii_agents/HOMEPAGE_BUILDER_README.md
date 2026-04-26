# Homepage Builder Agent

## Overview

The **Homepage Builder** is a specialized agent derived from Architect V2, designed to create complete, working homepages for e-commerce stores. It maintains the same accuracy and effectiveness as Architect V2 but with a focused scope limited to homepage creation.

## Key Features

- ✅ **Same Accuracy as Architect V2** - Uses the proven prompt engineering and workflow
- ✅ **Faster Execution** - 10-15 minutes vs 25-40 minutes (focused scope)
- ✅ **Complete Homepages** - Hero, featured products, categories, newsletter, trust badges
- ✅ **Dual Planning System** - HLD (features) + LLD (tasks) for organized development
- ✅ **Mobile-First Design** - Responsive, touch-friendly components
- ✅ **Lit Web Components** - Modern, maintainable component architecture
- ✅ **TailwindCSS Styling** - Utility-first CSS framework
- ✅ **GSAP Animations** - Smooth, professional animations
- ✅ **ESLint Validation** - Code quality assurance

## What It Creates

### Homepage Components

1. **Hero Section** - Animated hero with brand message and CTA
2. **Featured Products** - Product carousel or grid showcase
3. **Categories Grid** - Visual category navigation
4. **Promotional Banner** - Sales/announcements section
5. **Newsletter Signup** - Email capture form
6. **Trust Section** - Social proof, reviews, trust badges

### Project Structure

```
project/
├── assets/
│   ├── app.js              # Created - Imports homepage components
│   ├── state.js            # Created - 12+ products, 4+ categories
│   ├── router.js           # From infrastructure
│   ├── utils.js            # From infrastructure
│   ├── cart.js             # From infrastructure
│   └── wishlist.js         # From infrastructure
├── components/
│   ├── base-component.js   # From infrastructure
│   ├── hero-*.js           # Created - Hero component
│   ├── featured-products.js # Created - Product showcase
│   ├── categories-*.js     # Created - Categories display
│   └── newsletter-*.js     # Created - Newsletter form
├── pages/
│   └── page-home.js        # Created - Complete homepage
└── index.html              # Customized - Brand identity
```

## Usage

### Interactive Mode

```bash
cd experiments/scripts
python interactive_homepage_builder.py
```

Then enter your request:
```
You: Create a luxury jewelry homepage for "Aurelia Gems"
```

### Single Command Mode

```bash
python interactive_homepage_builder.py --message "Create a modern fashion homepage for 'StyleHub'"
```

### With Custom Chat ID

```bash
python interactive_homepage_builder.py --chat-id jewelry_homepage_v1
```

### As a Module

```python
from experiments.scripts.interactive_homepage_builder import run_homepage_builder_streaming

async for chunk in run_homepage_builder_streaming(
    chat_id="my_homepage",
    user_message="Create a luxury watch homepage"
):
    if chunk["chunk_type"] == "text":
        print(chunk["content"], end="")
    elif chunk["chunk_type"] == "done":
        print(f"\nCompleted in {chunk['stats']['elapsed_seconds']}s")
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `/help` | Show help information |
| `/status` | Show project status and metrics |
| `/files` | List all project files |
| `/tree` | Show directory tree structure |
| `/cat <file>` | Display file contents |
| `/open` | Open project folder in file explorer |
| `/quit` | Exit the CLI |

## Workflow

### Phase 0: Code Understanding
- Study infrastructure files
- Understand component patterns
- Learn routing and state management

### Phase 1: High-Level Design (HLD)
- Analyze business requirements
- Identify 5-8 homepage features
- Create feature list with `write_features()`

### Phase 2: Low-Level Design + Execution (LLD)
- For each feature:
  1. Break down into 5-8 tasks with `write_tasks()`
  2. Implement all tasks
  3. Validate with ESLint
  4. Mark completed
- Loop until all features complete

### Phase 3: Validation
- Verify all features completed
- Run full ESLint validation
- Check project structure
- Verify product/category data

## Comparison with Architect V2

| Feature | Architect V2 | Homepage Builder |
|---------|-------------|------------------|
| Scope | Full e-commerce store | Homepage only |
| Time | 25-40 minutes | 10-15 minutes |
| Pages Created | 7-9 pages | 1 page (home) |
| Components | 15-20 components | 6-8 components |
| Accuracy | High | High (same prompt) |
| Planning System | HLD + LLD | HLD + LLD |
| Validation | Full ESLint | Full ESLint |

## Example Prompts

### Luxury Brand
```
Create a luxury jewelry homepage for "Aurelia Gems" with elegant design, 
hero section showcasing premium pieces, and sophisticated animations.
```

### Modern Fashion
```
Create a trendy fashion homepage for "StyleHub" with bold colors, 
dynamic product carousel, and contemporary aesthetics.
```

### Tech/Electronics
```
Create a sleek electronics homepage for "TechVault" with modern design, 
featured gadgets section, and technical sophistication.
```

### Artisan/Handmade
```
Create an artisan homepage for "Handcrafted Haven" with warm tones, 
product storytelling, and authentic feel.
```

## Technical Details

### Tech Stack
- **Framework**: Lit Web Components
- **Styling**: TailwindCSS (utility classes only)
- **Animations**: GSAP with ScrollTrigger
- **Images**: Epicsum API
- **Icons**: Lucide (via CDN)
- **No Shadow DOM**: For Tailwind compatibility

### Planning Tools
- **Features** (HLD): `write_features`, `update_feature_status`, `count_features`
- **Tasks** (LLD): `write_tasks`, `update_task_status`, `clear_tasks`

### Validation
- **ESLint**: Full project validation
- **Structure**: Verify files/directories exist
- **Data**: Check products and categories

## Output Location

Projects are created in:
```
experiments/test_output_homepage/<chat_id>/
```

## Success Criteria

- ✅ All features completed (`count_features(status="pending")` == 0)
- ✅ ESLint validation passed (error_count == 0)
- ✅ page-home.js exists and is complete
- ✅ All homepage components created
- ✅ 12+ products in state.js
- ✅ 4+ categories in state.js
- ✅ index.html customized for brand

## Troubleshooting

### Agent Not Completing Features
- Check that `count_features(status="pending")` returns 0
- Review agent logs for stuck features
- Ensure ESLint validation passes

### Missing Components
- Verify feature list includes all necessary sections
- Check that Phase 2 completes all features
- Review task breakdown for completeness

### ESLint Errors
- Agent should auto-fix errors
- If persistent, check for syntax issues
- Review error messages in validation history

## Best Practices

1. **Clear Business Description** - Provide detailed brand identity
2. **Specific Design Preferences** - Mention colors, style, tone
3. **Target Audience** - Help agent understand user expectations
4. **Product Types** - Specify what products to showcase
5. **Unique Elements** - Mention any special homepage features needed

## Integration

The Homepage Builder can be integrated into larger workflows:

1. **Frontend Integration** - Use streaming API for real-time UI updates
2. **CMS Integration** - Connect to existing product databases
3. **Multi-Agent Systems** - Combine with other specialized agents
4. **CI/CD Pipeline** - Automate homepage generation

## Future Enhancements

Potential improvements:
- A/B testing variants
- Dynamic content personalization
- Multi-language support
- Accessibility enhancements
- Performance optimization
- SEO optimization

## Support

For issues or questions:
1. Check agent logs in `.doxii/` directory
2. Review validation history
3. Use `/status` command to check progress
4. Examine feature/task breakdown

## License

Same as parent project (DOXII).

