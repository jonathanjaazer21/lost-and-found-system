import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <textarea
          ref={ref}
          className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
