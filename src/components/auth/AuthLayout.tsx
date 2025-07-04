import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrçaFácil</span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-lg border-0 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          
          {children}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {footerText}{' '}
              <Link 
                to={footerLink} 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};