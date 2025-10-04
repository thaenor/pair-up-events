import React from "react";
import { twMerge } from "tailwind-merge";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";

export type OAuthProvider = 'google' | 'apple' | 'facebook';

export interface OAuthButtonProps {
    provider: OAuthProvider;
    label: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
    provider,
    label,
    className,
    onClick,
    disabled = false,
}) => {
    const getProviderIcon = () => {
        switch (provider) {
            case 'google':
                return <FaGoogle className="h-5 w-5" />;
            case 'apple':
                return <FaApple className="h-5 w-5" />;
            case 'facebook':
                return <FaFacebook className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const getProviderStyles = () => {
        switch (provider) {
            case 'google':
                return "hover:bg-white hover:text-gray-900 border-gray-300";
            case 'apple':
                return "hover:bg-black hover:text-white border-gray-600";
            case 'facebook':
                return "hover:bg-blue-600 hover:text-white border-blue-500";
            default:
                return "hover:bg-white hover:text-gray-900";
        }
    };

    const classes = twMerge(
        "flex items-center justify-center w-full px-4 py-3 my-2 border rounded-md text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        getProviderStyles(),
        className
    );

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="mr-3">{getProviderIcon()}</span>
            {label}
        </button>
    );
};

export default OAuthButton;
