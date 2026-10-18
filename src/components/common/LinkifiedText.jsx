import React, { memo } from "react";

// Regex matching http://, https://, or www.
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

/**
 * LinkifiedText parses text content and renders URLs as clickable links.
 * Clicking a link stops event propagation to prevent triggering parent card navigation.
 */
const LinkifiedText = ({
  text,
  className = "",
  linkClassName = "text-[var(--color-primary)] font-medium hover:underline hover:text-[var(--color-primary-hover)] underline-offset-2 break-all cursor-pointer transition-colors",
}) => {
  if (!text || typeof text !== "string") {
    return text || null;
  }

  const parts = [];
  let lastIndex = 0;
  let match;

  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const matchIndex = match.index;
    const rawMatch = match[0];

    // Push preceding text if any
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    let url = rawMatch;
    let trailing = "";

    // Strip trailing punctuation commonly appended to URLs in sentences (. , ! ? : ; ' " ])
    const punctMatch = url.match(/[.,!?:;"'\]]+$/);
    if (punctMatch) {
      trailing = punctMatch[0] + trailing;
      url = url.slice(0, -punctMatch[0].length);
    }

    // Handle closing parens when unbalanced (e.g. "(https://example.com)" vs "https://en.wikipedia.org/wiki/React_(software)")
    while (url.endsWith(")")) {
      const openCount = (url.match(/\(/g) || []).length;
      const closeCount = (url.match(/\)/g) || []).length;
      if (closeCount > openCount) {
        trailing = ")" + trailing;
        url = url.slice(0, -1);
      } else {
        break;
      }
    }

    const href =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    parts.push(
      <a
        key={`link-${matchIndex}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        title={href}
        className={linkClassName}
      >
        {url}
      </a>
    );

    if (trailing) {
      parts.push(trailing);
    }

    lastIndex = matchIndex + rawMatch.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (className) {
    return <span className={className}>{parts}</span>;
  }

  return <>{parts}</>;
};

export default memo(LinkifiedText);
