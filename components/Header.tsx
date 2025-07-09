
import React from 'react';
import { Language } from '../types';
import { useLanguage } from '../App';

interface HeaderProps {
  onSearch: (term: string) => void;
  onAddNew: () => void;
}

const LanguageButton: React.FC<{lang: Language, name: string}> = ({lang, name}) => {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      onClick={() => setLanguage(lang)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        language === lang ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {name}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ onSearch, onAddNew }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className="text-2xl font-bold text-blue-700 self-start md:self-center">{t.appTitle}</h1>
        
        <div className="flex items-center justify-between w-full md:w-auto md:justify-start space-x-4 rtl:space-x-reverse order-2 md:order-3">
            <button onClick={onAddNew} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors font-semibold flex-grow md:flex-grow-0">
                {t.addNewEntry}
            </button>
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 p-1 rounded-full">
                <LanguageButton lang="ku" name="کوردی" />
                <LanguageButton lang="ar" name="العربية" />
                <LanguageButton lang="en" name="EN" />
            </div>
        </div>

        <div className="w-full md:flex-1 md:max-w-xl md:mx-4 order-3 md:order-2">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;