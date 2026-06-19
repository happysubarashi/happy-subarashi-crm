import { cn } from "@/lib/utils";
import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-brand-purple-800 mb-1.5",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-11 px-3.5 rounded-xl border border-brand-purple-100 bg-white text-[15px]",
      "text-zinc-800 placeholder:text-zinc-400",
      "focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-300",
      "disabled:bg-zinc-50 disabled:text-zinc-400",
      "transition-shadow",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full px-3.5 py-3 rounded-xl border border-brand-purple-100 bg-white text-[15px]",
      "text-zinc-800 placeholder:text-zinc-400 min-h-[96px] resize-y",
      "focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-300",
      "transition-shadow",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const FieldError = ({ children }: { children?: string }) => {
  if (!children) return null;
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
};
