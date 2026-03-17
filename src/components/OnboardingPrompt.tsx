interface OnboardingPromptProps {
  fadingOut?: boolean;
}

export default function OnboardingPrompt({ fadingOut }: OnboardingPromptProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center ${
        fadingOut ? "animate-fade-out" : ""
      }`}
    >
      <div className="rounded-2xl bg-white/90 px-8 py-6 text-center shadow-lg backdrop-blur-sm dark:bg-gray-800/90">
        {/* Map pin icon */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500 dark:text-blue-400"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Select industries to get started
        </p>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Use the filters to explore companies on the map
        </p>
      </div>
    </div>
  );
}
