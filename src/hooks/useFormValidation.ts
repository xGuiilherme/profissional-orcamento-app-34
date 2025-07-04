import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface UseFormValidationProps {
  schema: ValidationSchema;
  initialValues?: Record<string, any>;
}

export const useFormValidation = ({ schema, initialValues = {} }: UseFormValidationProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      return `Mínimo de ${rule.minLength} caracteres`;
    }

    // Max length validation
    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return `Máximo de ${rule.maxLength} caracteres`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [schema, values, validateField]);

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field when touched
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};