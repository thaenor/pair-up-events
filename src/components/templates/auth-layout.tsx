import React from 'react'

export type AuthLayoutProps = {
  left: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ left }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen" data-testid="auth-layout">
      <div
        className="bg-[#1A2833] p-8 flex flex-col justify-center items-center order-2 md:order-1"
        data-testid="auth-layout-left"
      >
        {left}
      </div>
      <div className="order-1 md:order-2" data-testid="auth-layout-images">
        <img src="/Header Logo Mobile.png" alt="PairUp Events" className="w-full h-auto object-cover md:hidden" />
        <img
          src="/Header Logo Desktop.png"
          alt="PairUp Events"
          className="hidden md:block w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
