import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block font-data-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full bg-surface-lowest border border-outline-variant px-3 py-2 text-sm font-terminal text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-bright focus-visible:outline-none focus-visible:border-primary-container focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-error text-error placeholder:text-error/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-data-sm text-error uppercase tracking-tighter">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
