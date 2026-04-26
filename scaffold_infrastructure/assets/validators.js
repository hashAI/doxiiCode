/**
 * Universal Form Validation System
 *
 * Provides validation functions for e-commerce forms:
 * - Email, phone, address validation
 * - Credit card validation (Luhn algorithm)
 * - Password strength checking
 * - Zip code, tax ID validation
 * - Real-time validation helpers
 * - Custom validation rules
 */

// ============================================================================
// Email Validation
// ============================================================================

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email?.trim());

    return {
        valid: isValid,
        error: isValid ? null : 'Please enter a valid email address'
    };
}

export function validateEmailWithDomain(email, allowedDomains = []) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) return emailCheck;

    const domain = email.split('@')[1]?.toLowerCase();

    if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
        return {
            valid: false,
            error: `Email must be from: ${allowedDomains.join(', ')}`
        };
    }

    return { valid: true, error: null };
}

// ============================================================================
// Phone Validation
// ============================================================================

export function validatePhone(phone, countryCode = 'US') {
    const cleaned = phone.replace(/\D/g, '');

    // US phone validation (10 digits)
    if (countryCode === 'US') {
        const isValid = cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
        return {
            valid: isValid,
            error: isValid ? null : 'Please enter a valid 10-digit phone number'
        };
    }

    // International (at least 10 digits)
    const isValid = cleaned.length >= 10 && cleaned.length <= 15;
    return {
        valid: isValid,
        error: isValid ? null : 'Please enter a valid phone number'
    };
}

export function formatPhone(phone, countryCode = 'US') {
    const cleaned = phone.replace(/\D/g, '');

    if (countryCode === 'US' && cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
}

// ============================================================================
// Password Validation
// ============================================================================

export function validatePassword(password, options = {}) {
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = true
    } = options;

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors,
        strength: calculatePasswordStrength(password)
    };
}

export function calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

export function validatePasswordMatch(password, confirmPassword) {
    const match = password === confirmPassword;
    return {
        valid: match,
        error: match ? null : 'Passwords do not match'
    };
}

// ============================================================================
// Credit Card Validation
// ============================================================================

export function validateCreditCard(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it's all digits
    if (!/^\d+$/.test(cleaned)) {
        return {
            valid: false,
            error: 'Card number must contain only digits',
            type: null
        };
    }

    // Check length (13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) {
        return {
            valid: false,
            error: 'Invalid card number length',
            type: null
        };
    }

    // Luhn algorithm validation
    const isValid = luhnCheck(cleaned);
    const cardType = getCardType(cleaned);

    return {
        valid: isValid,
        error: isValid ? null : 'Invalid card number',
        type: cardType
    };
}

function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost digit
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return (sum % 10) === 0;
}

export function getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Card type patterns
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        dinersclub: /^3(?:0[0-5]|[68])/,
        jcb: /^35/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleaned)) {
            return type;
        }
    }

    return 'unknown';
}

export function formatCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    const type = getCardType(cleaned);

    // American Express: 4-6-5 format
    if (type === 'amex') {
        return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }

    // Others: 4-4-4-4 format
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
}

export function validateCVV(cvv, cardType = 'visa') {
    const cleaned = cvv.replace(/\D/g, '');

    // Amex uses 4 digits, others use 3
    const expectedLength = cardType === 'amex' ? 4 : 3;
    const isValid = cleaned.length === expectedLength;

    return {
        valid: isValid,
        error: isValid ? null : `CVV must be ${expectedLength} digits`
    };
}

export function validateExpiryDate(month, year) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    // Validate month range
    if (expMonth < 1 || expMonth > 12) {
        return {
            valid: false,
            error: 'Invalid month'
        };
    }

    // Handle 2-digit year (assume 20XX)
    const fullYear = expYear < 100 ? 2000 + expYear : expYear;

    // Check if expired
    if (fullYear < currentYear || (fullYear === currentYear && expMonth < currentMonth)) {
        return {
            valid: false,
            error: 'Card has expired'
        };
    }

    // Check if too far in the future (more than 20 years)
    if (fullYear > currentYear + 20) {
        return {
            valid: false,
            error: 'Invalid expiry date'
        };
    }

    return {
        valid: true,
        error: null,
        expiryDate: new Date(fullYear, expMonth - 1)
    };
}

// ============================================================================
// Address Validation
// ============================================================================

export function validateZipCode(zipCode, countryCode = 'US') {
    if (countryCode === 'US') {
        // US ZIP code: 5 digits or 5+4 format
        const usZipRegex = /^\d{5}(-\d{4})?$/;
        const isValid = usZipRegex.test(zipCode);

        return {
            valid: isValid,
            error: isValid ? null : 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
        };
    }

    if (countryCode === 'CA') {
        // Canadian postal code: A1A 1A1
        const caPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        const isValid = caPostalRegex.test(zipCode);

        return {
            valid: isValid,
            error: isValid ? null : 'Please enter a valid postal code (e.g., A1A 1A1)'
        };
    }

    // Generic validation for other countries
    const isValid = zipCode.trim().length >= 3;
    return {
        valid: isValid,
        error: isValid ? null : 'Please enter a valid postal code'
    };
}

export function validateAddress(address) {
    const errors = [];

    if (!address.street || address.street.trim().length < 3) {
        errors.push('Street address is required');
    }

    if (!address.city || address.city.trim().length < 2) {
        errors.push('City is required');
    }

    if (!address.state || address.state.trim().length < 2) {
        errors.push('State/Province is required');
    }

    const zipValidation = validateZipCode(address.zipCode || '', address.country || 'US');
    if (!zipValidation.valid) {
        errors.push(zipValidation.error);
    }

    if (!address.country || address.country.trim().length < 2) {
        errors.push('Country is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================================
// Name Validation
// ============================================================================

export function validateName(name, fieldName = 'Name') {
    const trimmed = name?.trim() || '';

    if (trimmed.length === 0) {
        return {
            valid: false,
            error: `${fieldName} is required`
        };
    }

    if (trimmed.length < 2) {
        return {
            valid: false,
            error: `${fieldName} must be at least 2 characters`
        };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        return {
            valid: false,
            error: `${fieldName} contains invalid characters`
        };
    }

    return {
        valid: true,
        error: null
    };
}

export function validateFullName(fullName) {
    const trimmed = fullName?.trim() || '';
    const parts = trimmed.split(/\s+/);

    if (parts.length < 2) {
        return {
            valid: false,
            error: 'Please enter your first and last name'
        };
    }

    return validateName(fullName, 'Full name');
}

// ============================================================================
// Required Field Validation
// ============================================================================

export function validateRequired(value, fieldName = 'This field') {
    const hasValue = value !== null &&
                     value !== undefined &&
                     value.toString().trim().length > 0;

    return {
        valid: hasValue,
        error: hasValue ? null : `${fieldName} is required`
    };
}

export function validateMinLength(value, minLength, fieldName = 'This field') {
    const length = value?.toString().trim().length || 0;
    const isValid = length >= minLength;

    return {
        valid: isValid,
        error: isValid ? null : `${fieldName} must be at least ${minLength} characters`
    };
}

export function validateMaxLength(value, maxLength, fieldName = 'This field') {
    const length = value?.toString().trim().length || 0;
    const isValid = length <= maxLength;

    return {
        valid: isValid,
        error: isValid ? null : `${fieldName} must be no more than ${maxLength} characters`
    };
}

// ============================================================================
// Number Validation
// ============================================================================

export function validateNumber(value, options = {}) {
    const {
        min = -Infinity,
        max = Infinity,
        integer = false,
        fieldName = 'Value'
    } = options;

    const num = Number(value);

    if (isNaN(num)) {
        return {
            valid: false,
            error: `${fieldName} must be a number`
        };
    }

    if (integer && !Number.isInteger(num)) {
        return {
            valid: false,
            error: `${fieldName} must be a whole number`
        };
    }

    if (num < min) {
        return {
            valid: false,
            error: `${fieldName} must be at least ${min}`
        };
    }

    if (num > max) {
        return {
            valid: false,
            error: `${fieldName} must be no more than ${max}`
        };
    }

    return {
        valid: true,
        error: null,
        value: num
    };
}

export function validateQuantity(quantity) {
    return validateNumber(quantity, {
        min: 1,
        max: 999,
        integer: true,
        fieldName: 'Quantity'
    });
}

// ============================================================================
// URL Validation
// ============================================================================

export function validateURL(url) {
    try {
        new URL(url);
        return {
            valid: true,
            error: null
        };
    } catch (e) {
        return {
            valid: false,
            error: 'Please enter a valid URL'
        };
    }
}

// ============================================================================
// Date Validation
// ============================================================================

export function validateDate(dateString) {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());

    return {
        valid: isValid,
        error: isValid ? null : 'Please enter a valid date',
        date: isValid ? date : null
    };
}

export function validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            valid: false,
            error: 'Invalid dates'
        };
    }

    if (start > end) {
        return {
            valid: false,
            error: 'Start date must be before end date'
        };
    }

    return {
        valid: true,
        error: null
    };
}

// ============================================================================
// Form Validation
// ============================================================================

export function validateForm(formData, validationRules) {
    const errors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([field, rules]) => {
        const value = formData[field];

        for (const rule of rules) {
            const result = rule(value);

            if (!result.valid) {
                errors[field] = result.error || result.errors;
                isValid = false;
                break; // Stop at first error for this field
            }
        }
    });

    return {
        valid: isValid,
        errors
    };
}

// Example usage:
// const result = validateForm(formData, {
//     email: [validateEmail],
//     password: [(val) => validatePassword(val, { minLength: 8 })],
//     phone: [validatePhone]
// });

// ============================================================================
// Real-time Validation Helper
// ============================================================================

export class FormValidator {
    constructor(validationRules = {}) {
        this.rules = validationRules;
        this.errors = {};
        this.touched = {};
    }

    validate(field, value) {
        const rules = this.rules[field];
        if (!rules) return { valid: true, error: null };

        for (const rule of rules) {
            const result = rule(value);
            if (!result.valid) {
                this.errors[field] = result.error || result.errors;
                return result;
            }
        }

        delete this.errors[field];
        return { valid: true, error: null };
    }

    validateAll(formData) {
        let isValid = true;
        this.errors = {};

        Object.keys(this.rules).forEach(field => {
            const result = this.validate(field, formData[field]);
            if (!result.valid) {
                isValid = false;
            }
        });

        return {
            valid: isValid,
            errors: { ...this.errors }
        };
    }

    markTouched(field) {
        this.touched[field] = true;
    }

    isTouched(field) {
        return this.touched[field] === true;
    }

    getError(field) {
        return this.isTouched(field) ? this.errors[field] : null;
    }

    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }

    clearErrors() {
        this.errors = {};
        this.touched = {};
    }
}
