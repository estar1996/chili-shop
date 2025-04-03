"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox } 