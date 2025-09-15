import { AuthLayout } from "@/components/templates/auth-layout";
import { SocialAuthButton } from "@/components/molecules/social-auth-button";
import { Mail, Apple, Facebook } from "lucide-react";

const AuthPage = () => {
    const leftContent = (
        <div className="w-full max-w-sm">
            <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
            <h1 className="text-4xl font-bold text-white mb-8">Sign up</h1>
            <SocialAuthButton
                icon={
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="h-6 w-6"
                    />
                } // Using Google favicon as a simple icon
                label="Sign up with Google"
            />
            <SocialAuthButton icon={<Apple />} label="Sign up with Apple" />
            <SocialAuthButton
                icon={<Facebook />}
                label="Sign up with Facebook"
            />
            <SocialAuthButton icon={<Mail />} label="Sign up with E-Mail" />
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-500" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#1A2833] text-gray-400">or</span>
                </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base w-full bg-[#F2E8D8] text-[#1A2833] hover:bg-opacity-90">
                Login to my account
            </button>
        </div>
    );

    return <AuthLayout left={leftContent} />;
};

export default AuthPage;
