/*
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type SocialAuthButtonProps = {
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
};

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({ icon, label, className, onClick }) => {
  const classes = twMerge(
    'flex items-center justify-center w-full px-4 py-3 my-2 border border-white rounded-md text-white font-medium hover:bg-white hover:text-[#1A2833] transition-colors',
    className,
  );

  return (
    <button className={classes} onClick={onClick}>
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};
*/