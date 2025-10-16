import { AuthLayout } from '@/components/templates/auth-layout'
import EmailSignupForm from '@/components/molecules/Auth/email-signup-form'

const AuthPage = () => {
  const leftContent = (
    <div className="w-full max-w-sm">
      <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
      <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>

      {/* Email Signup Form */}
      <EmailSignupForm />
    </div>
  )

  return <AuthLayout left={leftContent} />
}

export default AuthPage
