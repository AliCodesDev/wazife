import { useEffect, useRef } from "react";
import type { Company } from "../types/company";
import { INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

interface CompanyCardProps {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyCard({ company, onClose }: CompanyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus the card when it opens, trap Tab inside
  useEffect(() => {
    if (!company || !cardRef.current) return;

    // Focus the card container
    cardRef.current.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !cardRef.current) return;

      const focusable = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [company]);

  // Close on Escape
  useEffect(() => {
    if (!company) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [company, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!company) return;

    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid closing from the same click that opened it
    const timer = setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleClick);
    };
  }, [company, onClose]);

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
        company ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!company}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-label={company ? `Company details: ${company.name}` : undefined}
        className="pointer-events-auto w-full max-w-[500px] rounded-t-2xl bg-white p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] outline-none dark:bg-gray-800 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] max-sm:max-h-[60vh] max-sm:overflow-y-auto"
      >
        {company && (
          <>
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {company.name}
                </h2>
                {company.name_ar && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                    {company.name_ar}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close company details"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            {/* Industry tags + city */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {company.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: INDUSTRY_COLORS[ind] }}
                >
                  {INDUSTRY_LABELS[ind]}
                </span>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {company.city}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {company.description}
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-3 text-sm">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1={10} y1={14} x2={21} y2={3} />
                  </svg>
                  Website
                </a>
              )}
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {company.email}
                </a>
              )}
              {company.careers_url && (
                <a
                  href={company.careers_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x={2} y={7} width={20} height={14} rx={2} ry={2} />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Careers
                </a>
              )}
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {company.phone}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
