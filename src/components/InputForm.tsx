// src/components/InputForm.tsx
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface InputFormProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  [key: string]: any;
}

export const InputForm: React.FC<InputFormProps> = ({
  label,
  name,
  type = 'text',
  register,
  errors,
  ...rest
}) => {
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        {...rest}
        className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};