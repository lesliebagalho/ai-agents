"use client";

import { useState } from "react";

type ImagePreviewProps = {
  url?: string | null;
};

export default function ImagePreview({ url }: ImagePreviewProps) {
  const [broken, setBroken] = useState(false);

  if (!url || broken) return null;

  return (
    <div className="image-preview">
      <img
        src={url}
        alt="Preview"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
