import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import cn from "@/lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const Button = ({ 
  title, 
  variant = 'primary', 
  className,
  loading = false,
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-lg items-center justify-center";
  const variantStyles = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    danger: "bg-red-500"
  };

  return (
    <TouchableOpacity 
      className={cn(
        baseStyles,
        variantStyles[variant],
        (disabled || loading) && "opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-base font-medium">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;