"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const RainbowButtonSimple = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex h-10 items-center justify-center rounded-lg px-6 font-medium text-white",
          "bg-gradient-to-r from-[#1179BC] via-[#3B9DD6] via-[#5BB5E8] via-[#7BCDF5] to-[#00D4FF]",
          "bg-[length:200%_auto] animate-gradient hover:bg-right-center",
          "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/50",
          "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r",
          "before:from-[#1179BC] before:via-[#3B9DD6] before:via-[#5BB5E8] before:via-[#7BCDF5] before:to-[#00D4FF]",
          "before:bg-[length:200%_auto] before:blur-md before:-z-10 before:opacity-50 before:animate-gradient",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

RainbowButtonSimple.displayName = "RainbowButtonSimple"

