import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold font-display",
  {
    variants: {
      variant: {
        forest: "bg-forest-700 text-cream-50",
        leaf: "bg-leaf-100 text-forest-700",
        sky: "bg-sky-100 text-sky-400",
        sunset: "bg-sunset-400/20 text-sunset-400",
        earth: "bg-earth-600/20 text-earth-600",
      },
    },
    defaultVariants: { variant: "leaf" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
