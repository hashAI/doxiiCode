#!/usr/bin/env python3
import sys
import os
sys.path.append('experiments/doxii_agents/validators')

from eslint_validator import ESLintValidator

validator = ESLintValidator()
result = validator.validate_file('/Users/hash/Projects/doxii/experiments/test_output/interactive_20251105_142203/components/product-card.js')
print("Result:")
print(result)
