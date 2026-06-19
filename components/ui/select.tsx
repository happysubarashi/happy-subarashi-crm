import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "w-full h-11 pl-3.5 pr-9 rounded-xl border border-brand-purple-100 bg-white text-[15px]",
        "text-zinc-800 appearance-none",
        "focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-300",
        "transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
  </div>
));
Select.displayName = "Select";
