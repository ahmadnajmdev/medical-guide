import React, { useState, useEffect } from 'react';
import { Entry } from '../types';
import SpecialAdCard from './SpecialAdCard';
import { useLanguage } from '../App';

interface SpecialAdCarouselProps {
  ads: Entry[];
  onSelect: (entry: Entry) => void;
}

const SpecialAdCarousel: React.FC<SpecialAdCarouselProps> = ({ ads, onSelect }) => {
  const { t } = useLanguage();
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 3) {
      return; // No rotation needed if there aren't enough ads to rotate
    }
    const timer = setInterval(() => {
      setStartIndex(prevIndex => (prevIndex + 1) % ads.length);
    }, 7000); // Rotate every 7 seconds (increased from 5s)

    return () => clearInterval(timer);
  }, [ads.length]);

  const displayedAds: Entry[] = [];
  if (ads.length > 0) {
    for (let i = 0; i < Math.min(3, ads.length); i++) {
      displayedAds.push(ads[(startIndex + i) % ads.length]);
    }
  }

  if (displayedAds.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-md text-gray-500">{t.noSpecialAds}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedAds.map(ad => (
        <div key={ad.id} className="animate-fade-in">
          <SpecialAdCard item={ad} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
};

export default SpecialAdCarousel;