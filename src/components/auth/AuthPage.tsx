
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F5E6C8] mb-4">
          <span className="text-[#27E9F3]">Pair</span>
          <span className="text-[#FECC08]">Up Events</span>
        </h1>
        <p className="text-[#F5E6C8]/80 mb-8">Connect with other pairs for amazing shared experiences</p>
        
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
