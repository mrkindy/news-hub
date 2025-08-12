import React from 'react';
import { Layout } from '../components/layout/Layout';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};