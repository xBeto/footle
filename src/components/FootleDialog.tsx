"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

type FootleDialogContentProps = React.ComponentProps<typeof DialogContent> & {
  title?: string
  description?: string
}

export function FootleDialogContent({
  title,
  description,
  className,
  children,
  ...props
}: FootleDialogContentProps) {
  return (
    <DialogContent
      showCloseButton
      className={cn(
        // Frame and surface
        "bg-[#111e29] border-[3px] border-[#f0d36c] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white",
        // Subtle inner edge
        "[box-shadow:inset_0_0_12px_rgba(0,0,0,0.45),_0_10px_30px_rgba(0,0,0,0.5)]",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <DialogHeader>
          {title && (
            <DialogTitle className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className="text-white/80">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
      )}
      {children}
    </DialogContent>
  )
}

export { Dialog, DialogTrigger }