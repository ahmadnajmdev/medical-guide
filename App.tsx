
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Entry, Category, Language, AdType, SpecialAdType } from './types';
import { translations } from './localization/translations';
import Header from './components/Header';
import AdTicker from './components/AdTicker';
import MainContent from './components/MainContent';
import CategoryList from './components/CategoryList';
import DetailPage from './components/DetailPage';
import DataEntryForm from './components/DataEntryForm';
import SpecialAdCarousel from './components/SpecialAdCarousel';

// Generate more mock data for pagination
const createMockEntries = () => {
    const baseEntries: (Omit<Entry, 'id' | 'images' | 'video' | 'coverImageIndex'> & { id: string; image: string })[] = [
         { 
            id: 'doc1', category: Category.Doctors, 
            name: { ku: 'د. هەوار کەمال', ar: 'د. هوار كمال', en: 'Dr. Hawar Kamal' },
            image: 'https://picsum.photos/seed/doc1/400/300', 
            details: { ku: 'پسپۆڕی نەخۆشییەکانی دڵ بە ١٠ ساڵ ئەزموون.', ar: 'أخصائي أمراض القلب بخبرة 10 سنوات.', en: 'Cardiologist with 10 years of experience.' },
            phone: '+9647501234567', 
            location: { ku: 'هەولێر، نەخۆشخانەی هێڤی', ar: 'أربيل، مستشفى هيفي', en: 'Erbil, Hevi Hospital' },
            views: 120, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.MainPage,
        },
        { 
            id: 'hos1', category: Category.Hospitals, 
            name: { ku: 'نەخۆشخانەی CMC', ar: 'مستشفى CMC', en: 'CMC Hospital' },
            image: 'https://picsum.photos/seed/hos1/400/300', 
            details: { ku: 'نەخۆشخانەیەکی پێشەنگی تایبەت.', ar: 'مستشفى خاص رائد.', en: 'A leading private hospital.' },
            phone: '+9647507654321', 
            location: { ku: 'سلێمانی، شەقامی بازنەیی مەلیک مەحمود', ar: 'السليمانية، شارع حلقة الملك محمود', en: 'Sulaymaniyah, Malik Mahmud Ring Road' },
            views: 350, isFavorite: true, adType: AdType.Normal, specialAdType: SpecialAdType.None,
        },
        { 
            id: 'lab1', category: Category.Labs, 
            name: { ku: 'تاقیگەی شار', ar: 'مختبر شار', en: 'Shar Laboratory' },
            image: 'https://picsum.photos/seed/lab1/400/300', 
            details: { ku: 'ئەنجامی پشکنینی ورد و خێرا.', ar: 'نتائج اختبار دقيقة وسريعة.', en: 'Accurate and fast test results.' },
            phone: '+9647701122334', 
            location: { ku: 'هەولێر، شەقامی ٤٠ مەتری', ar: 'أربيل، شارع 40 متر', en: 'Erbil, 40m Street' },
            views: 88, isFavorite: false, adType: AdType.Normal, specialAdType: SpecialAdType.None,
        },
        { 
            id: 'pharma1', category: Category.Pharmacies, 
            name: { ku: 'دەرمانخانەی دەوا', ar: 'صيدلية دواء', en: 'Dawa Pharmacy' },
            image: 'https://picsum.photos/seed/pharma1/400/300', 
            details: { ku: '٢٤ کاتژمێر کراوەیە. هەموو دەرمانەکان بەردەستن.', ar: 'مفتوح 24/7. جميع الأدوية متوفرة.', en: 'Open 24/7. All medicines available.' },
            phone: '+9647519876543', 
            location: { ku: 'دهۆک، ماڵتا', ar: 'دهوك، مالطا', en: 'Duhok, Malta' },
            views: 150, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.Ticker, 
            tickerText: { ku: 'دەرمانخانەی دەوا - خزمەتگوزاری ٢٤/٧', ar: 'صيدلية دواء - خدمة 24/7', en: 'Dawa Pharmacy - 24/7 service' }
        },
        { 
            id: 'equip1', category: Category.Equipment, 
            name: { ku: 'میدیکاڵ پڕۆ', ar: 'ميديكال برو', en: 'Medical Pro' },
            image: 'https://picsum.photos/seed/equip1/400/300', 
            details: { ku: 'پێداویستی پزیشکی کوالێتی بەرز.', ar: 'معدات طبية عالية الجودة.', en: 'High-quality medical equipment.' },
            phone: '+9647705556677', 
            location: { ku: 'هەولێر، ناوچەی پیشەسازی', ar: 'أربيل، المنطقة الصناعية', en: 'Erbil, Industrial Zone' },
            views: 45, isFavorite: false, adType: AdType.Normal, specialAdType: SpecialAdType.None
        },
        { 
            id: 'doc2', category: Category.Doctors, 
            name: { ku: 'د. نازا محەمەد', ar: 'د. نازا محمد', en: 'Dr. Naza Mohammed' },
            image: 'https://picsum.photos/seed/doc2/400/300', 
            details: { ku: 'پسپۆڕی پسپۆڕی منداڵان.', ar: 'أخصائية طب الأطفال.', en: 'Pediatrician specialist.' },
            phone: '+9647508889900', 
            location: { ku: 'سلێمانی، نەخۆشخانەی ئەڵمانی', ar: 'السليمانية، المستشفى الألماني', en: 'Sulaymaniyah, German Hospital' },
            views: 210, isFavorite: true, adType: AdType.Normal, specialAdType: SpecialAdType.None
        },
        { 
            id: 'hos2', category: Category.Hospitals, 
            name: { ku: 'نەخۆشخانەی پار', ar: 'مستشفى بار', en: 'PAR Hospital' },
            image: 'https://picsum.photos/seed/hos2/400/300', 
            details: { ku: 'ڕێکاری نەشتەرگەری پێشکەوتوو.', ar: 'إجراءات جراحية متقدمة.', en: 'Advanced surgical procedures.' },
            phone: '+9647501112233', 
            location: { ku: 'هەولێر، ڕێگای بارزانی نەمری', ar: 'أربيل، طريق بارزاني الخالد', en: 'Erbil, Barzani Namr Road' },
            views: 400, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.MainPage 
        },
         { 
            id: 'doc3-special', category: Category.Doctors, 
            name: { ku: 'کلینیکی نوور', ar: 'عيادة نور', en: 'Noor Clinic' },
            image: 'https://picsum.photos/seed/doc3/400/300', 
            details: { ku: 'پسپۆڕی چاو.', ar: 'أخصائي عيون.', en: 'Ophthalmologist.' },
            phone: '+9647501231231', 
            location: { ku: 'هەولێر', ar: 'أربيل', en: 'Erbil' },
            views: 300, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.MainPage,
        },
        { 
            id: 'lab2-special', category: Category.Labs, 
            name: { ku: 'تاقیگەی مێدیکال', ar: 'مختبر ميديكال', en: 'Medical Lab' },
            image: 'https://picsum.photos/seed/lab2/400/300', 
            details: { ku: 'پشکنینی گشتی.', ar: 'فحوصات عامة.', en: 'General tests.' },
            phone: '+9647703213213', 
            location: { ku: 'سلێمانی', ar: 'السليمانية', en: 'Sulaymaniyah' },
            views: 180, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.MainPage,
        },
        { 
            id: 'hos3-special', category: Category.Hospitals, 
            name: { ku: 'نەخۆشخانەی ئاشتی', ar: 'مستشفى آشتي', en: 'Ashti Hospital' },
            image: 'https://picsum.photos/seed/hos3/400/300', 
            details: { ku: 'خزمەتگوزاری فریاکەوتن.', ar: 'خدمات طوارئ.', en: 'Emergency services.' },
            phone: '+9647514445566', 
            location: { ku: 'دهۆک', ar: 'دهوك', en: 'Duhok' },
            views: 450, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.MainPage,
        },
        { 
            id: 'pharma2', category: Category.Pharmacies, 
            name: { ku: 'دەرمانخانەی لانا', ar: 'صيدلية لانا', en: 'Lana Pharmacy' },
            image: 'https://picsum.photos/seed/pharma2/400/300', 
            details: { ku: 'ستافێکی دۆستانە و کۆمەڵێک بەرهەمی بەرفراوان.', ar: 'فريق عمل ودود ومجموعة واسعة من المنتجات.', en: 'Friendly staff and wide range of products.' },
            phone: '+9647703334455', 
            location: { ku: 'کەرکوک، شۆرجە', ar: 'كركوك، شورجة', en: 'Kirkuk, Shorja' },
            views: 95, isFavorite: false, adType: AdType.Special, specialAdType: SpecialAdType.Ticker, 
            tickerText: { ku: 'داشکاندنی تایبەت لە دەرمانخانەی لانا!', ar: 'خصم خاص في صيدلية لانا!', en: 'Special discount at Lana Pharmacy!' }
        }
    ];

    // Convert old structure to new structure and add coverImageIndex
    const allEntries: Entry[] = baseEntries.map(({ image, ...rest }) => ({
      ...rest,
      images: [image],
      coverImageIndex: 0,
    }));

    // Create ~50 more entries for pagination
    for (let i = 1; i <= 6; i++) {
        baseEntries.forEach(entry => {
            // Only duplicate normal ads to fill the pages
            if (entry.adType === AdType.Normal) {
                const newId = `${entry.id}-${i}`;
                allEntries.push({
                    id: newId,
                    category: entry.category,
                    name: Object.fromEntries(Object.entries(entry.name).map(([lang, name]) => [lang, `${name} ${i}`])) as Record<Language, string>,
                    images: [entry.image.replace(/seed\/\w+/, `seed/${newId}`)],
                    coverImageIndex: 0,
                    details: entry.details,
                    phone: entry.phone,
                    location: entry.location,
                    views: Math.floor(Math.random() * 500),
                    isFavorite: Math.random() > 0.8,
                    adType: AdType.Normal, 
                    specialAdType: SpecialAdType.None,
                });
            }
        });
    }

    return allEntries;
};

// Key for localStorage
const LOCAL_STORAGE_KEY = 'medical-guide-entries';

// Language Context
type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Record<string, string>;
};
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};

type View = 'list' | 'details' | 'form';

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('ku');
    const [entries, setEntries] = useState<Entry[]>(() => {
        try {
            const storedEntries = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            return storedEntries ? JSON.parse(storedEntries) : createMockEntries();
        } catch (error) {
            console.error("Failed to parse entries from localStorage", error);
            return createMockEntries();
        }
    });

    const [view, setView] = useState<View>('list');
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Helper function to save to localStorage and update state
    const saveAndSetEntries = (updater: (prevState: Entry[]) => Entry[]) => {
        setEntries(prevState => {
            const newState = updater(prevState);
            try {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
            } catch (error) {
                console.error("Failed to save entries to localStorage", error);
                alert('Could not save data. Your browser storage might be full or you are in private mode.');
            }
            return newState;
        });
    };

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = (language === 'ar' || language === 'ku') ? 'rtl' : 'ltr';
    }, [language]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm]);

    const handleSelectEntry = (entry: Entry) => {
        const updatedEntry = { ...entry, views: entry.views + 1 };
        saveAndSetEntries(prev => prev.map(e => (e.id === entry.id ? updatedEntry : e)));
        setSelectedEntry(updatedEntry);
        setView('details');
    };

    const handleToggleFavorite = (id: string) => {
        saveAndSetEntries(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
    };

    const handleAddNewEntry = (newEntryData: Omit<Entry, 'id' | 'views' | 'isFavorite'>) => {
        const newEntry: Entry = {
            ...newEntryData,
            id: `entry_${Date.now()}`,
            views: 0,
            isFavorite: false,
        };
        saveAndSetEntries(prev => [newEntry, ...prev]);
        setView('list');
    };

    const languageContextValue = {
        language,
        setLanguage,
        t: translations[language],
    };

    const renderContent = () => {
        switch (view) {
            case 'details':
                return selectedEntry && <DetailPage item={selectedEntry} onBack={() => setView('list')} />;
            case 'form':
                return <DataEntryForm onSubmit={handleAddNewEntry} onCancel={() => setView('list')} />;
            case 'list':
            default:
                return (
                    <div className="flex flex-col lg:flex-row container mx-auto px-4 lg:p-4 gap-6">
                        <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                        <MainContent
                            entries={entries}
                            selectedCategory={selectedCategory}
                            searchTerm={searchTerm}
                            onSelectEntry={handleSelectEntry}
                            onToggleFavorite={handleToggleFavorite}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                );
        }
    };

    return (
        <LanguageContext.Provider value={languageContextValue}>
            <div className="bg-gray-50 min-h-screen font-sans">
                <Header onSearch={setSearchTerm} onAddNew={() => setView('form')} />
                <AdTicker entries={entries} onSelectAd={handleSelectEntry} />
                
                {renderContent()}
            </div>
        </LanguageContext.Provider>
    );
};

export default App;