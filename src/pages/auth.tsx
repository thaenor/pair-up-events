import { AuthLayout } from '@/components/templates/auth-layout';
import { SocialAuthButton } from '@/components/molecules/social-auth-button';
import Button from '@/components/atoms/Button';
import { Mail, Apple, Facebook } from 'lucide-react';

const AuthPage = () => {
  const leftContent = (
    <div className="w-full max-w-sm">
      <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
      <h1 className="text-4xl font-bold text-white mb-8">Sign up</h1>
      <SocialAuthButton
        icon={<img src="https://www.google.com/favicon.ico" alt="Google" className="h-6 w-6" />} // Using Google favicon as a simple icon
        label="Sign up with Google"
      />
      <SocialAuthButton icon={<Apple />} label="Sign up with Apple" />
      <SocialAuthButton icon={<Facebook />} label="Sign up with Facebook" />
      <SocialAuthButton icon={<Mail />} label="Sign up with E-Mail" />
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-500" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#1A2833] text-gray-400">or</span>
        </div>
      </div>
      <Button className="w-full bg-[#F2E8D8] text-[#1A2833] hover:bg-opacity-90">
        Login to my account
      </Button>
    </div>
  );

  return <AuthLayout left={leftContent} />;
};

export default AuthPage;
