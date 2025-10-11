import type { ReactNode, FormEvent } from 'react';

interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
  className?: string;
  isLoading?: boolean;
}

/**
 * Form wrapper component that provides consistent form styling and behavior
 * Handles form submission and loading states
 */
const FormWrapper = ({
  children,
  onSubmit,
  className = '',
  isLoading = false,
}: FormWrapperProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      <fieldset disabled={isLoading} className="space-y-6">
        {children}
      </fieldset>
    </form>
  );
};

export default FormWrapper;
