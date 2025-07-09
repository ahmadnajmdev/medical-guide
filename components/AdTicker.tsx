import React, { useState, useEffect } from 'react';
import { Entry, SpecialAdType } from '../types';
import { useLanguage } from '../App';

interface AdTickerProps {
  entries: Entry[];
  onSelectAd: (entry: Entry) => void;
}

const AdTicker: React.FC<AdTickerProps> = ({ entries, onSelectAd }) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const tickerAds = entries.filter(e => e.specialAdType === SpecialAdType.Ticker).slice(0, 10);

  useEffect(() => {
    if (tickerAds.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % tickerAds.length);
      }, 7000); // Rotate every 7 seconds
      return () => clearInterval(timer);
    }
  }, [tickerAds.length]);

  if (tickerAds.length === 0) {
    return null;
  }

  const currentAd = tickerAds[currentIndex];

  return (
    <div className="bg-red-800 flex items-center justify-between overflow-hidden h-12 px-4 text-white">
      {/* Label */}
      <div className="bg-white text-red-800 font-bold px-3 py-1 rounded-md whitespace-nowrap z-10">
        {t.specialAdsTickerLabel}
      </div>

      {/* Ad Text (centered and animated) */}
      <div className="flex-grow text-center mx-4 overflow-hidden">
        <span
          key={currentAd.id}
          className="text-lg font-semibold animate-fade-in inline-block whitespace-nowrap"
        >
          {currentAd.tickerText?.[language] || currentAd.name[language]}
        </span>
      </div>

      {/* See More Button */}
      <button
        onClick={() => onSelectAd(currentAd)}
        className="bg-[#008080] hover:bg-teal-700 text-white font-semibold px-4 py-1 rounded-md whitespace-nowrap transition-colors z-10"
      >
        {t.seeMore}
      </button>
    </div>
  );
};

export default AdTicker;
