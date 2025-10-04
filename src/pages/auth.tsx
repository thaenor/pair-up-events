import { AuthLayout } from "@/components/templates/auth-layout";
import EmailSignupForm from "@/components/molecules/email-signup-form";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
    const { error } = useAuth();

    const leftContent = (
        <div className="w-full max-w-sm">
            <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
            <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>

            {/* Global error message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Email Signup Form */}
            <EmailSignupForm />
        </div>
    );

    return <AuthLayout left={leftContent} />;
};

export default AuthPage;
