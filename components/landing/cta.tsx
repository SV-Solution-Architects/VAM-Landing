import { START_BRIEF_URL } from "@/lib/site";
import { Arrow } from "./brand-symbols";

/** The one call to action on the page: start a hiring brief in the VA Marketplace app. */
export function StartBriefLink({
  children = "Start your hiring brief",
  className = "",
  arrow = true,
}: {
  children?: React.ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a href={START_BRIEF_URL} className={`btn btn-primary ${className}`} target="_blank" rel="noopener">
      {children}
      {arrow && <Arrow />}
    </a>
  );
}
