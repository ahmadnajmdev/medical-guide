import React from 'react';
import { Entry, Category, AdType, SpecialAdType } from '../types';
import ItemCard from './ItemCard';
import Pagination from './Pagination';
import { useLanguage } from '../App';
import SpecialAdCarousel from './SpecialAdCarousel';

interface MainContentProps {
  entries: Entry[];
  selectedCategory: Category | null;
  searchTerm: string;
  onSelectEntry: (entry: Entry) => void;
  onToggleFavorite: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  entries,
  selectedCategory,
  searchTerm,
  onSelectEntry,
  onToggleFavorite,
  currentPage,
  onPageChange,
}) => {
  const { t, language } = useLanguage();
  const ITEMS_PER_PAGE = 40;

  // Logic to determine which entries to display in the main grid
  let gridEntries: Entry[];

  if (selectedCategory === Category.Custom) {
    // For "Favorites", filter ALL entries (including special ads) that are favorited
    gridEntries = entries.filter(entry => 
      entry.isFavorite && 
      (entry.name[language] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else {
    // For all other categories, filter only normal entries
    gridEntries = entries.filter(entry => {
      // Exclude special ads from the regular list to avoid duplication with the carousel
      if (entry.adType === AdType.Special) return false;
      
      const matchesCategory = !selectedCategory || entry.category === selectedCategory;
      const matchesSearch = (entry.name[language] || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  // Paginate the filtered grid entries
  const totalPages = Math.ceil(gridEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = gridEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // The carousel shows special ads, but should be hidden when viewing favorites
  const showCarousel = selectedCategory !== Category.Custom;
  const specialAdsForCarousel = entries.filter(e => e.specialAdType === SpecialAdType.MainPage);

  return (
    <main className="flex-1 p-4">
      {/* Special Ads Section (Carousel) - Moved back here to scroll with content */}
      {showCarousel && specialAdsForCarousel.length > 0 && (
         <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-3">{t.specialAdsMainPageTitle}</h2>
            <SpecialAdCarousel ads={specialAdsForCarousel} onSelect={onSelectEntry} />
         </div>
      )}

      {/* Main Content Grid */}
      {paginatedEntries.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedEntries.map(entry => (
              <ItemCard
                key={entry.id}
                item={entry}
                onSelect={onSelectEntry}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">{t.noResults}</p>
        </div>
      )}
    </main>
  );
};

export default MainContent;