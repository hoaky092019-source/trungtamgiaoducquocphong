import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-pro-primary text-white hover:bg-blue-600 focus:ring-pro-primary shadow-lg shadow-blue-500/30",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
