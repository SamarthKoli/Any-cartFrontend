import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;