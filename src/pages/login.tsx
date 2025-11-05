import { AuthLayout } from '@/components/templates/auth-layout'
import EmailLoginForm from '@/components/molecules/Auth/email-login-form'

const LoginPage = () => {
  const leftContent = (
    <div className="w-full max-w-sm">
      <img src="/Logo.png" alt="PairUp Events" className="h-12 mb-8" />
      <h1 className="text-4xl font-bold text-white mb-8">Welcome Back</h1>

      {/* Email Login Form */}
      <EmailLoginForm />
    </div>
  )

  return <AuthLayout left={leftContent} />
}

export default LoginPage
