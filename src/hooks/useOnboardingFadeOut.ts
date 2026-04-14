import { useState, useEffect, useRef } from "react";

/**
 * Tracks the transition from no-filters → has-filters and returns
 * whether the onboarding prompt should be fading out.
 */
export function useOnboardingFadeOut(hasFilters: boolean) {
  const [fadingOut, setFadingOut] = useState(false);
  const hadFiltersRef = useRef(false);

  useEffect(() => {
    if (hasFilters && !hadFiltersRef.current) {
      setFadingOut(true);
      const timer = setTimeout(() => setFadingOut(false), 400);
      hadFiltersRef.current = true;
      return () => clearTimeout(timer);
    }
    if (!hasFilters) {
      hadFiltersRef.current = false;
    }
  }, [hasFilters]);

  return fadingOut;
}
