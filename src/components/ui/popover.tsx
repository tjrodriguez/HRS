"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Positioner.Props & { sideOffset?: number }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        sideOffset={sideOffset}
        {...props}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-popup"
          className={cn(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
            className
          )}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverArrow({ className, ...props }: PopoverPrimitive.Arrow.Props) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(
        "data-[side=bottom]:rotate-180 data-[side=left]:-rotate-90 data-[side=right]:rotate-90",
        className
      )}
      {...props}
    >
      <svg width="10" height="5" viewBox="0 0 10 5" fill="none" className="fill-popover stroke-border">
        <path d="M0 0L5 5L10 0H0Z" />
      </svg>
    </PopoverPrimitive.Arrow>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow }
