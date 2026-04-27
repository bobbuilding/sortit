import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-surface-2 border border-primary-container text-primary-container hover:bg-primary-container/10",
      secondary: "bg-surface-2 border border-outline-variant text-on-surface hover:border-primary-container hover:text-primary-container",
      ghost: "bg-transparent border border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-1",
      danger: "bg-surface-2 border border-error text-error hover:bg-error/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[10px]",
      md: "px-6 py-2.5 text-xs",
      lg: "px-8 py-3.5 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-data-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
