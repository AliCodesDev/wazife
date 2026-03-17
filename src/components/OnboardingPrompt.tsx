export default function OnboardingPrompt() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="rounded-xl bg-white/90 px-6 py-4 text-center shadow-lg backdrop-blur dark:bg-gray-800/90">
        <p className="text-base font-medium text-gray-700 dark:text-gray-200">
          Select industries to get started
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Use the filters to explore companies on the map
        </p>
      </div>
    </div>
  );
}
