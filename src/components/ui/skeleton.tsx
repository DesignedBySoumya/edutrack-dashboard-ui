import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-2xl",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 block w-full h-full animate-shimmer bg-gradient-to-r from-muted via-gray-700/30 to-muted opacity-60" />
    </div>
  )
}

export { Skeleton }

// Add shimmer animation to global CSS if not present:
// .animate-shimmer {
//   animation: shimmer 1.5s infinite linear;
//   background-size: 200% 100%;
// }
// @keyframes shimmer {
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }
