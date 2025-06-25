
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  error?: string;
  helper?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'host' | 'guest';
  hover?: boolean;
}

export interface NavigationProps {
  isLoggedIn?: boolean;
  onGetStarted?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}
