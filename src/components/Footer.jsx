"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * Footer — production-ready, accessible, theme-friendly.
 *
 * Props:
 *  - companyName: string
 *  - links: array of { title, href, external }
 *  - contactEmail: string (optional)
 *  - variant: "muted" | "solid" (visual style)
 *  - year: number (defaults to current year)
 *
 * Notes:
 *  - No network or analytics inside footer; keep it render-only for perf.
 *  - All external links open with rel="noopener noreferrer".
 */

function Footer({
  companyName,
  links,
  contactEmail,
  variant,
  year,
  className,
}) {
  const themeClasses =
    variant === "muted"
      ? "bg-indigo-50/60 dark:bg-indigo-900/30 border-t border-indigo-200/20 dark:border-indigo-800/30 text-indigo-900 dark:text-indigo-100"
      : "bg-gradient-to-r from-indigo-700 to-indigo-600 text-white";

  const safeYear = React.useMemo(() => year || new Date().getFullYear(), [year]);

  return (
    <footer
      className={`${themeClasses} ${className ?? ""} w-full`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand / left */}
          <div className="flex items-center gap-3">
            {/* Logo placeholder: replace with your logo later */}
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-white/10"
              aria-hidden="true"
              title={companyName}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="white" fillOpacity="0.12" />
                <path d="M7 12h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.9" />
              </svg>
            </span>

            <div>
              <div className="font-semibold">{companyName}</div>
              <div className="text-xs opacity-80">Study smarter — not longer</div>
            </div>
          </div>

          {/* Center: navigation links */}
          <nav
            className="flex flex-wrap items-center gap-3 justify-center"
            aria-label="Footer navigation"
          >
            {links && links.length > 0 ? (
              links.map((ln) => (
                <a
                  key={ln.title}
                  href={ln.href}
                  className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-sm px-1"
                  {...(ln.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {ln.title}
                </a>
              ))
            ) : (
              <span className="text-sm text-muted">No links configured</span>
            )}
          </nav>

          {/* Right: contact and small meta */}
          <div className="flex items-center gap-4 justify-end">
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-sm px-1"
                aria-label={`Email ${companyName} at ${contactEmail}`}
              >
                {contactEmail}
              </a>
            ) : null}

            <div className="text-sm opacity-80 text-right" aria-live="polite">
              © {safeYear} {companyName}
            </div>
          </div>
        </div>

        {/* Optional small print row */}
        <div className="mt-4 pt-4 border-t border-indigo-200/10 dark:border-indigo-800/20 text-xs opacity-80 flex flex-col md:flex-row md:justify-between gap-2">
          <div>Designed & built with ♥ — StudyBuddy</div>
          <div className="text-right">Version: <span className="font-medium">1.0.0</span></div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  companyName: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      external: PropTypes.bool,
    })
  ),
  contactEmail: PropTypes.string,
  variant: PropTypes.oneOf(["muted", "solid"]),
  year: PropTypes.number,
  className: PropTypes.string,
};

Footer.defaultProps = {
  companyName: "StudyBuddy",
  links: [
    { title: "Home", href: "/", external: false },
    { title: "Resources", href: "/resources", external: false },
    { title: "Study Timer", href: "/study-timer", external: false },
    { title: "Privacy", href: "/privacy", external: false },
    { title: "Terms", href: "/terms", external: false },
  ],
  contactEmail: "", // set in layout or parent via prop
  variant: "muted",
  year: null,
  className: "",
}

export default React.memo(Footer);
