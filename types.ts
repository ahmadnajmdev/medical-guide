export enum Category {
  Doctors = 'doctors',
  Hospitals = 'hospitals',
  Labs = 'labs',
  Pharmacies = 'pharmacies',
  Equipment = 'equipment',
  Charity = 'charity',
  Custom = 'custom',
}

export enum AdType {
  Normal = 'normal',
  Special = 'special',
}

export enum SpecialAdType {
  None = 'none',
  Ticker = 'ticker',
  MainPage = 'main_page',
}

export type Language = 'ku' | 'ar' | 'en';

export interface Entry {
  id: string;
  category: Category;
  name: Record<Language, string>;
  images: string[];
  coverImageIndex: number; // To track which image is the main one
  video?: string;
  details: Record<Language, string>;
  phone: string;
  location: Record<Language, string>;
  views: number;
  isFavorite: boolean;
  adType: AdType;
  specialAdType: SpecialAdType;
  tickerText?: Record<Language, string>;
}