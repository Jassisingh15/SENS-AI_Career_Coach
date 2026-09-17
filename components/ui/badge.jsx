import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-indigo-500/20 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:bg-indigo-500/20",
        secondary:
          "border-white/10 bg-slate-800/60 text-slate-300 hover:bg-slate-800/90",
        destructive:
          "border-rose-500/20 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)] hover:bg-rose-500/20",
        outline:
          "border-white/15 text-slate-300 hover:border-white/30",
        cyan:
          "border-cyan-500/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:bg-cyan-500/20",
        emerald:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:bg-emerald-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
