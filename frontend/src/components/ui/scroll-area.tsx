"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <div
        data-slot="scroll-area-viewport"
        className="h-full w-full overflow-y-auto overflow-x-hidden min-w-0 focus-visible:ring-ring/50 rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
        style={{ minWidth: 0, display: 'block' }}
      >
        <div className="min-w-0 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

// Keep named export to avoid breaking imports elsewhere
function ScrollBar() {
  return null
}

export { ScrollArea, ScrollBar }
