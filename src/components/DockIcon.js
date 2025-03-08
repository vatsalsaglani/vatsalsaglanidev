"use client";

import Image from "next/image";

export default function DockIcon({ icon, label, onClick }) {
  return (
    <button 
      className="dock-icon group relative"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-lg hover:bg-light-text/5 dark:hover:bg-dark-text/5 flex items-center justify-center transition-all duration-200 group-hover:scale-110 overflow-hidden">
        <Image
          src={`/assets/dockicons/${icon}`}
          alt={label}
          width={48}
          height={48}
          className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-light-surface dark:bg-dark-surface px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-light-text dark:text-dark-text">
        {label}
      </span>
    </button>
  );
}
