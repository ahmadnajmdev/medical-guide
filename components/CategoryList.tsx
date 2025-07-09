
import React from 'react';
import { Category } from '../types';
import { useLanguage } from '../App';

interface CategoryListProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, onSelectCategory }) => {
  const { t } = useLanguage();
  const categories = [
    null, // For "All"
    Category.Doctors,
    Category.Hospitals,
    Category.Labs,
    Category.Pharmacies,
    Category.Equipment,
    Category.Charity,
    Category.Custom,
  ];

  const categoryNames: Record<string, string> = {
    all: t.allCategories,
    [Category.Doctors]: t.doctors,
    [Category.Hospitals]: t.hospitals,
    [Category.Labs]: t.labs,
    [Category.Pharmacies]: t.pharmacies,
    [Category.Equipment]: t.equipment,
    [Category.Charity]: t.charity,
    [Category.Custom]: t.custom,
  };

  return (
    <aside className="w-full lg:w-64 lg:p-4 self-start lg:sticky lg:top-24">
      <nav>
        <ul className="flex flex-row lg:flex-col overflow-x-auto whitespace-nowrap lg:whitespace-normal pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((cat) => (
            <li key={cat || 'all'} className="flex-shrink-0 lg:flex-shrink-1 lg:mb-2 mx-1 lg:mx-0">
              <button
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-center lg:text-start rtl:lg:text-right px-4 py-3 rounded-lg transition-colors duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#008080] text-white font-bold shadow-lg'
                    : 'text-gray-800 font-medium hover:bg-teal-100 hover:text-[#008080]'
                }`}
              >
                {categoryNames[cat || 'all']}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default CategoryList;