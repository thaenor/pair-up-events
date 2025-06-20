import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
interface LoginFormProps {
  onToggleMode: () => void;
}
const LoginForm: React.FC<LoginFormProps> = ({
  onToggleMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[#1A2A33]">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#1A2A33]">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border-[#1A2A33]/20 bg-slate-50" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#1A2A33]">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border-[#1A2A33]/20 bg-slate-50" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33] font-semibold">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={onToggleMode} className="text-[#27E9F3] hover:underline">
            Don't have an account? Sign up
          </button>
        </div>
      </CardContent>
    </Card>;
};
export default LoginForm;