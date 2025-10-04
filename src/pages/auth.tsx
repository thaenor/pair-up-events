import { AuthLayout } from "@/components/templates/auth-layout";
import { SocialAuthButton } from "@/components/molecules/social-auth-button";
import OAuthButton from "@/components/molecules/oauth-button";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

const AuthPage = () => {
    const {
        signInWithGoogle,
        signInWithApple,
        signInWithFacebook,
        signInWithEmail,
        loading,
        error,
        clearError
    } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            clearError();
            await signInWithGoogle();
        } catch (error) {
            console.error('Google sign in failed:', error);
        }
    };

    const handleAppleSignIn = async () => {
        try {
            clearError();
            await signInWithApple();
        } catch (error) {
            console.error('Apple sign in failed:', error);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            clearError();
            await signInWithFacebook();
        } catch (error) {
            console.error('Facebook sign in failed:', error);
        }
    };

    const handleEmailSignIn = async () => {
        // For now, we'll just show an alert. In a real app, you'd have a form
        const email = prompt('Enter your email:');
        const password = prompt('Enter your password:');

        if (email && password) {
            try {
                clearError();
                await signInWithEmail(email, password);
            } catch (error) {
                console.error('Email sign in failed:', error);
            }
        }
    };

    const leftContent = (
        <div className="w-full max-w-sm">
            <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
            <h1 className="text-4xl font-bold text-white mb-8">Sign up</h1>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <OAuthButton
                        provider="google"
                        label="Sign up with Google"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    />
                    <OAuthButton
                        provider="apple"
                        label="Sign up with Apple"
                        onClick={handleAppleSignIn}
                        disabled={loading}
                    />
                    <OAuthButton
                        provider="facebook"
                        label="Sign up with Facebook"
                        onClick={handleFacebookSignIn}
                        disabled={loading}
                    />
                    <SocialAuthButton
                        icon={<Mail />}
                        label="Sign up with E-Mail"
                        onClick={handleEmailSignIn}
                        className={loading ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-500" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1A2833] text-gray-400">or</span>
                        </div>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base w-full bg-[#F2E8D8] text-[#1A2833] hover:bg-opacity-90"
                        onClick={handleEmailSignIn}
                    >
                        Login to my account
                    </button>
                </>
            )}
        </div>
    );

    return <AuthLayout left={leftContent} />;
};

export default AuthPage;
