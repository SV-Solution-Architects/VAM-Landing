import { ArrowRightIcon } from "lucide-react";
import { cn } from "cn";
import { START_BRIEF_URL } from "@/lib/site";

const SIZES = {
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

/** The one call to action on the page: start a hiring brief in the VA Marketplace app. */
export function StartBriefLink({
  size = "lg",
  children = "Start your hiring brief",
  className,
}: {
  size?: keyof typeof SIZES;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={START_BRIEF_URL}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-colors",
        "hover:bg-[#e06f16] focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none",
        SIZES[size],
        className
      )}
    >
      {children}
      <ArrowRightIcon className="size-4" aria-hidden />
    </a>
  );
}
