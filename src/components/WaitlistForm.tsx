import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Phone, User, Building2, Mail, AlertCircle } from 'lucide-react';
import { WaitlistFormData } from '../types';
import { sendWaitlistEmail } from '../utils/email';
import { useWaitlistStore } from '../store/waitlistStore';

interface FormFieldProps {
  name: keyof WaitlistFormData;
  label: string;
  icon: React.ElementType;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string | undefined;
  touched: boolean | undefined;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  icon: Icon,
  type = "text",
  required = false,
  autoComplete,
  value,
  onChange,
  onBlur,
  error = '',
  touched = false,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value);
  const isErrorVisible = touched && error;

  return (
    <div className="space-y-2">
      <div className={`
        relative rounded-md border bg-white
        ${isErrorVisible ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}
        ${hasValue ? 'border-gray-300' : ''}
        focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20
      `}>
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur();
            }}
            className={`
              block w-full pl-10 pr-3
              ${hasValue ? 'pt-6 pb-2' : 'py-4'}
              text-gray-900 focus:outline-none focus:ring-0 border-0
              disabled:opacity-50
            `}
            disabled={disabled}
            autoComplete={autoComplete}
            required={required}
          />
          
          <label
            htmlFor={name}
            className={`
              absolute left-10 transition-all duration-200 pointer-events-none
              ${hasValue || isFocused ? 'top-2 text-xs text-gray-500' : 'top-1/2 -translate-y-1/2 text-gray-500'}
            `}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        </div>
      </div>
      
      {isErrorVisible && (
        <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

interface WaitlistFormProps {
  // Empty interface since we don't need any props
}

const WaitlistForm: React.FC<WaitlistFormProps> = () => {
  const { initialEmail, source, closeModal } = useWaitlistStore();
  const [formData, setFormData] = useState<WaitlistFormData>(() => ({
    name: '',
    email: initialEmail || '',
    company: '',
    phone: '',
    source: source || 'direct',
  }));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof WaitlistFormData, value: string): string => {
    if (!value.trim() && name !== 'phone') {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    
    if (name === 'phone' && value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
      return "Please enter a valid phone number";
    }
    
    return '';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const fields: (keyof WaitlistFormData)[] = ['name', 'email', 'company', 'phone'];
    
    fields.forEach((field) => {
      const error = validateField(field, formData[field] as string);
      if (error) errors[field] = error;
    });
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError(null);
    setIsSubmitting(true);

    try {
      if (window.gtag) {
        window.gtag('event', 'begin_waitlist_submission', {
          source: source,
        });
      }

      const success = await sendWaitlistEmail(formData);
      if (success) {
        setSubmitted(true);
        if (window.gtag) {
          window.gtag('event', 'complete_waitlist_submission', {
            source: source,
          });
        }
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      if (window.gtag) {
        window.gtag('event', 'waitlist_submission_error', {
          source: source,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <motion.div 
            className="mb-4 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-full bg-green-500/10 p-3">
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You're on the Waitlist!
          </motion.h2>
          <motion.p 
            className="text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Check your email for your exclusive access details.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-[1px]">
      <div className="relative rounded-[calc(0.75rem-1px)] bg-white p-6 sm:p-8">
        <BackgroundEffect />
        
        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Join Our Waitlist
            </h2>
            <p className="mt-2 text-gray-600">
              Get early access to our enterprise AI platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-4">
              <FormField
                name="name"
                label="Full Name"
                icon={User}
                required
                autoComplete="name"
                value={formData.name || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                onBlur={() => {
                  const error = validateField('name', formData.name || '');
                  setFieldErrors(prev => ({ ...prev, name: error }));
                  setTouched(prev => ({ ...prev, name: true }));
                }}
                error={fieldErrors.name}
                touched={touched.name}
                disabled={isSubmitting}
              />
              
              <FormField
                name="email"
                label="Email Address"
                type="email"
                icon={Mail}
                required
                autoComplete="email"
                value={formData.email || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                onBlur={() => {
                  const error = validateField('email', formData.email || '');
                  setFieldErrors(prev => ({ ...prev, email: error }));
                  setTouched(prev => ({ ...prev, email: true }));
                }}
                error={fieldErrors.email}
                touched={touched.email}
                disabled={isSubmitting}
              />
              
              <FormField
                name="company"
                label="Company Name"
                icon={Building2}
                required
                autoComplete="organization"
                value={formData.company || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
                onBlur={() => {
                  const error = validateField('company', formData.company || '');
                  setFieldErrors(prev => ({ ...prev, company: error }));
                  setTouched(prev => ({ ...prev, company: true }));
                }}
                error={fieldErrors.company}
                touched={touched.company}
                disabled={isSubmitting}
              />
              
              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                icon={Phone}
                autoComplete="tel"
                value={formData.phone || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                onBlur={() => {
                  const error = validateField('phone', formData.phone || '');
                  setFieldErrors(prev => ({ ...prev, phone: error }));
                  setTouched(prev => ({ ...prev, phone: true }));
                }}
                error={fieldErrors.phone}
                touched={touched.phone}
                disabled={isSubmitting}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-md bg-red-50 p-3 text-sm text-red-500 flex items-center gap-2"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={`
                w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600
                px-4 py-3 font-semibold text-white shadow-lg
                transition-all duration-300
                hover:shadow-purple-500/25
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Join Waitlist'
              )}
            </motion.button>
            
            <p className="text-center text-xs text-gray-500">
              By joining, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

function BackgroundEffect() {
  return (
    <div
      className="pointer-events-none absolute -right-64 -top-64 opacity-5"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="856"
        height="745"
        fill="none"
      >
        <g filter="url(#a)">
          <path
            fill="url(#b)"
            fillRule="evenodd"
            d="m56 88 344 212-166 188L56 88Z"
            clipRule="evenodd"
          />
        </g>
        <g filter="url(#c)">
          <path
            fill="url(#d)"
            fillRule="evenodd"
            d="m424 257 344 212-166 188-178-400Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1="210.5"
            x2="210.5"
            y1="88"
            y2="467"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="d"
            x1="578.5"
            x2="578.5"
            y1="257"
            y2="636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter
            id="a"
            width="520"
            height="576"
            x="-32"
            y="0"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
          <filter
            id="c"
            width="520"
            height="576"
            x="336"
            y="169"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default WaitlistForm;