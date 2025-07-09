import React from 'react';
import { Entry } from '../types';
import { useLanguage } from '../App';
import { EyeIcon, HeartIcon } from './icons';

interface ItemCardProps {
  item: Entry;
  onSelect: (item: Entry) => void;
  onToggleFavorite: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onToggleFavorite }) => {
  const { t, language } = useLanguage();
  const displayViews = item.views * 7;
  
  // Use the cover image index, with a fallback to the first image
  const imageSrc = (item.images && item.images.length > 0) 
    ? item.images[item.coverImageIndex] || item.images[0]
    : 'https://placehold.co/400x300?text=No+Image';


  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite icon
    onToggleFavorite(item.id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onSelect(item)}
    >
      <div className="relative">
        <img className="h-48 w-full object-cover" src={imageSrc} alt={item.name[language]} />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm rounded-full p-2 text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
          aria-label="Toggle Favorite"
        >
          <HeartIcon className="w-6 h-6" isFilled={item.isFavorite} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-blue-500 uppercase font-semibold">{t[item.category]}</p>
        <h3 className="font-bold text-xl mt-1 text-gray-900">{item.name[language]}</h3>
        <p className="text-gray-600 text-sm mt-2 flex-grow">{(item.details[language] || '').substring(0, 70)}...</p>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <EyeIcon className="w-5 h-5 me-2" />
            <span>{displayViews.toLocaleString()} {t.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;