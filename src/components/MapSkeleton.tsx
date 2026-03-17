export default function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-skeleton-pulse">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 dark:text-gray-500"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </div>
        <span className="text-sm text-gray-400 dark:text-gray-500 animate-skeleton-pulse">
          Loading map...
        </span>
      </div>
    </div>
  );
}
