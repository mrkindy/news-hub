import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useContext';
import { useLanguage } from '../../hooks/useLanguage';
import { isValidEmail } from '../../utils/helpers';
import { LoginFormData, LoginFormErrors } from '../../types/forms';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.validEmailRequired');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      throw new Error('Failed to log in: ' + error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.welcomeBack')}</h1>
        <p className="text-gray-600 mt-2">{t('auth.signInToAccount')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t('auth.email')}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="password"
            placeholder={t('auth.password')}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? t('auth.signingIn') : t('common.signIn')}
        </Button>

        <div className="text-center pt-4">
          <p className="text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {t('auth.signUpHere')}
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};