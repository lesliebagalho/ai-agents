"use client";

import { useState } from "react";

type ProductThumbProps = {
  url?: string | null;
  alt: string;
};

export default function ProductThumb({ url, alt }: ProductThumbProps) {
  const [broken, setBroken] = useState(false);

  if (!url || broken) {
    return (
      <div className="product-thumb product-thumb--placeholder">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className="product-thumb"
      onError={() => setBroken(true)}
    />
  );
}
