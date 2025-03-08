'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function Wallpaper() {
  const { theme } = useTheme();
  
  const wallpaperPath = `/assets/wallpapers/Sequoia${theme === 'light' ? 'Light' : 'Dark'}.png`;
  console.log('Current wallpaper path:', wallpaperPath);
  
  return (
    <div className="fixed inset-0 z-behind">
      <Image
        src={wallpaperPath}
        alt="Wallpaper"
        fill
        priority
        className="object-cover"
        quality={100}
        sizes="100vw"
      />
    </div>
  );
} 