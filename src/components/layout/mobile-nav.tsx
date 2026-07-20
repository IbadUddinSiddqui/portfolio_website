"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.1, 0, 1] as const,
    },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0 border-l border-border/50">
        <div className="flex flex-col h-full bg-background/95 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <span className="text-sm font-semibold tracking-tight">Navigation</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex flex-col justify-center px-6 py-8 gap-1">
            <AnimatePresence mode="wait">
              {navLinks.map(({ href, label }, i) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={href}
                    custom={i}
                    variants={open ? linkVariants : undefined}
                    initial={open ? "hidden" : false}
                    animate={open ? "visible" : false}
                    exit="exit"
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          isActive ? "bg-primary scale-100" : "bg-muted-foreground/30 scale-0"
                        )}
                      />
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
