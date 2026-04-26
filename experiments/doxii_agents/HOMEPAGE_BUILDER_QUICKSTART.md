# Homepage Builder - Quick Start Guide

## 🚀 Quick Start

```bash
cd /Users/hash/Projects/doxii/experiments/scripts
python interactive_homepage_builder.py
```

Then type:
```
You: Create a luxury jewelry homepage for "Aurelia Gems"
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `experiments/doxii_agents/homepage_builder.py` | Agent definition |
| `experiments/scripts/interactive_homepage_builder.py` | CLI interface |
| `experiments/scripts/test_homepage_builder_setup.py` | Setup verification |

## ✅ Verification

```bash
python experiments/scripts/test_homepage_builder_setup.py
```

Expected: ✅ All tests passing (4/4)

## 📊 Comparison

| Feature | Architect V2 | Homepage Builder |
|---------|-------------|------------------|
| Time | 25-40 min | 10-15 min |
| Pages | 7-9 | 1 (homepage) |
| Components | 15-20 | 6-8 |

## 💡 Example Prompts

### Luxury Brand
```
Create a luxury jewelry homepage for "Aurelia Gems" with elegant design
```

### Modern Fashion
```
Create a trendy fashion homepage for "StyleHub" with bold colors
```

### Tech/Electronics
```
Create a sleek electronics homepage for "TechVault" with modern design
```

## 🎯 Output Location

```
experiments/test_output_homepage/<chat_id>/
```

## 📝 CLI Commands

- `/help` - Show help
- `/status` - Project status
- `/files` - List files
- `/tree` - Directory tree
- `/cat <file>` - Show file
- `/open` - Open folder
- `/quit` - Exit

## 🔧 Usage Modes

### Interactive
```bash
python interactive_homepage_builder.py
```

### Single Command
```bash
python interactive_homepage_builder.py --message "Create homepage for store"
```

### With Chat ID
```bash
python interactive_homepage_builder.py --chat-id my_homepage_v1
```

## 📚 Documentation

See `HOMEPAGE_BUILDER_README.md` for complete documentation.

