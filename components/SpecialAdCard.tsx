import React from 'react';
import { Entry } from '../types';
import { useLanguage } from '../App';

interface SpecialAdCardProps {
  item: Entry;
  onSelect: (item: Entry) => void;
}

const SpecialAdCard: React.FC<SpecialAdCardProps> = ({ item, onSelect }) => {
  const { t, language } = useLanguage();
  
  // Use the cover image index, with a fallback to the first image
  const imageSrc = (item.images && item.images.length > 0) 
    ? item.images[item.coverImageIndex] || item.images[0]
    : 'https://placehold.co/400x300?text=No+Image';

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-yellow-400 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(item)}
    >
      {/* Increased image height from h-32 to h-56 to make the card taller and more prominent */}
      <img className="h-56 w-full object-cover" src={imageSrc} alt={item.name[language]} />
      {/* Enhanced the content area for a richer look */}
      <div className="p-4 flex flex-col flex-grow">
         {/* Added category for context, using the app's theme color */}
        <p className="text-sm text-[#008080] uppercase font-bold">{t[item.category]}</p>
         {/* Increased title size for better visibility */}
        <h3 className="font-bold text-lg mt-1 text-gray-900">{item.name[language]}</h3>
      </div>
    </div>
  );
};

export default SpecialAdCard;