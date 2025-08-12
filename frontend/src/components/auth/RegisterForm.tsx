import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useContext';
import { useLanguage } from '../../hooks/useLanguage';
import { isValidEmail } from '../../utils/helpers';
import { RegisterFormData, RegisterFormErrors } from '../../types/forms';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = t('auth.first_nameRequired');
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = t('auth.last_nameRequired');
    }

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

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = t('auth.confirmPasswordRequired');
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = t('auth.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
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
      await register(formData);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context, log for debugging
      throw new Error('Failed to register: ' + error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.createAccount')}</h1>
        <p className="text-gray-600 mt-2">{t('auth.joinNewsHub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              name="first_name"
              placeholder={t('auth.first_name')}
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              name="last_name"
              placeholder={t('auth.last_name')}
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="email"
            name="email"
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
            placeholder={t('auth.createPassword')}
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

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="password_confirmation"
            autoComplete="password"
            placeholder={t('auth.confirmPassword')}
            value={formData.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>

        <div className="text-center pt-4">
          <p className="text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};