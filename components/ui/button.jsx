import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] text-white shadow-lg shadow-indigo-950/50 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-rose-600/90 text-white shadow-sm hover:bg-rose-600 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-[0.98]",
        outline:
          "border border-indigo-500/30 bg-slate-900/40 text-slate-200 shadow-sm hover:bg-indigo-500/10 hover:border-indigo-400 hover:text-white backdrop-blur-sm",
        secondary:
          "border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white backdrop-blur-md shadow-sm active:scale-[0.98]",
        ghost:
          "text-slate-300 hover:bg-white/5 hover:text-white",
        link:
          "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
