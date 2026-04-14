import { MapIcon } from "./Icon";

export default function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-skeleton-pulse">
          <MapIcon size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <span className="text-sm text-gray-400 dark:text-gray-500 animate-skeleton-pulse">
          Loading map...
        </span>
      </div>
    </div>
  );
}
