"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/FootleDialog";
import { FootleDialogContent } from "@/components/FootleDialog";

type InfoDialogProps = {
  title: string;
  children: React.ReactNode; // content of the modal
  triggerLabel?: string;
};

export default function InfoDialog({ title, children, triggerLabel = "How it works" }: InfoDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-4 py-2 rounded-lg border border-white/25 text-white bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium backdrop-blur-sm">
        {triggerLabel}
      </DialogTrigger>
      <FootleDialogContent title={title}>
        <div className="space-y-3 text-white/90 text-sm">
          {children}
        </div>
      </FootleDialogContent>
    </Dialog>
  );
}


