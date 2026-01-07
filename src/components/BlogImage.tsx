'use client';

interface BlogImageProps {
  src: string;
  alt: string;
  title: string;
}

export function BlogImage({ src, alt, title }: BlogImageProps) {
  return (
    <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg mb-6 overflow-hidden">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800"><div class="text-center"><div class="text-4xl mb-2">📝</div><div class="font-semibold">${title}</div></div></div>`;
          }
        }}
      />
    </div>
  );
}
