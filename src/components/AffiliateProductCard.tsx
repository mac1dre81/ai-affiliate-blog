'use client';

import { trackClick } from '@/lib/affiliate';

interface AffiliateProductCardProps {
  title: string;
  description: string;
  linkId: string;
  href?: string;
}

export function AffiliateProductCard({ 
  title, 
  description, 
  linkId,
  href = "#" 
}: AffiliateProductCardProps) {
  const handleClick = () => {
    trackClick(linkId);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{description}</p>
      <a 
        href={href}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block transition-colors"
      >
        Check Price →
      </a>
    </div>
  );
}
