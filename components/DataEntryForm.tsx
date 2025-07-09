

import React, { useState } from 'react';
import { Entry, Category, AdType, SpecialAdType, Language } from '../types';
import { useLanguage } from '../App';
import { MapPinIcon, XCircleIcon, StarIcon } from './icons';

interface DataEntryFormProps {
  onSubmit: (entry: Omit<Entry, 'id' | 'views' | 'isFavorite'>) => void;
  onCancel: () => void;
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({ onSubmit, onCancel }) => {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<Category>(Category.Doctors);
  const [name, setName] = useState<Record<Language, string>>({ ku: '', ar: '', en: '' });
  const [images, setImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [video, setVideo] = useState<string | undefined>(undefined);
  const [details, setDetails] = useState<Record<Language, string>>({ ku: '', ar: '', en: '' });
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<Record<Language, string>>({ ku: '', ar: '', en: '' });
  const [adType, setAdType] = useState<AdType>(AdType.Normal);
  const [specialAdType, setSpecialAdType] = useState<SpecialAdType>(SpecialAdType.None);
  const [tickerText, setTickerText] = useState<Record<Language, string>>({ ku: '', ar: '', en: '' });
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 20) {
        setError(t.maxImagesWarning);
        return;
      }
      setError('');
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== indexToRemove));
    // Adjust coverImageIndex if the removed image affects it
    if (coverImageIndex === indexToRemove) {
      setCoverImageIndex(0); // Reset to the first image if the cover was removed
    } else if (coverImageIndex > indexToRemove) {
      setCoverImageIndex(prevIndex => prevIndex - 1); // Decrement index if an image before it was removed
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVideo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = () => {
    setVideo(undefined);
  };

  const handleMultilingualChange = (
    setter: React.Dispatch<React.SetStateAction<Record<Language, string>>>,
    lang: Language,
    value: string
  ) => {
    setter(prev => ({ ...prev, [lang]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
        setError('Please upload at least one image.');
        return;
    }
    const newEntry: Omit<Entry, 'id' | 'views' | 'isFavorite'> = {
      category,
      name,
      images,
      coverImageIndex,
      video,
      details,
      phone,
      location,
      adType,
      specialAdType: adType === AdType.Special ? specialAdType : SpecialAdType.None,
      tickerText: adType === AdType.Special && specialAdType === SpecialAdType.Ticker ? tickerText : undefined,
    };
    onSubmit(newEntry);
  };
  
  const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const formLabelStyle = "block text-sm font-bold text-gray-800";
  
  const isRtl = language !== 'en';

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl my-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t.dataEntryFormTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className={formLabelStyle}>{t.selectCategory}</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className={formInputStyle}>
            {Object.values(Category)
              .filter(cat => cat !== Category.Custom)
              .map(cat => (
              <option key={cat} value={cat}>{t[cat]}</option>
            ))}
          </select>
        </div>
        
        <div>
            <label htmlFor="name" className={formLabelStyle}>{t.nameOfPlaceOrPerson}</label>
            <input
                id="name"
                type="text"
                placeholder={t.nameOfPlaceOrPerson}
                value={name[language] || ''}
                onChange={e => handleMultilingualChange(setName, language, e.target.value)}
                className={formInputStyle}
                dir={isRtl ? 'rtl' : 'ltr'}
                required
            />
        </div>
        
        {/* Image Upload Section */}
        <div>
            <label className={formLabelStyle}>{t.uploadImages}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple />
                        </label>
                        <p className="ps-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {images.length > 0 && 
                <div className="mt-4">
                    <p className={formLabelStyle}>{t.imagePreviews}</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 mt-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative group">
                                <div className={`absolute inset-0 rounded-lg transition-all ${coverImageIndex === index ? 'ring-4 ring-offset-2 ring-teal-500' : ''}`}></div>
                                <img src={img} alt={`Preview ${index + 1}`} className="h-24 w-24 object-cover rounded-lg"/>
                                <div className="absolute top-0 right-0 flex flex-col items-center p-1 space-y-1">
                                    <button type="button" title={t.remove} onClick={() => removeImage(index)} className="bg-white/80 rounded-full text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon className="w-6 h-6" />
                                    </button>
                                    <button type="button" title={t.setAsCover} onClick={() => setCoverImageIndex(index)} className={`bg-white/80 rounded-full transition-all ${coverImageIndex === index ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400 opacity-50 group-hover:opacity-100'}`}>
                                        <StarIcon className="w-6 h-6" isFilled={coverImageIndex === index} />
                                    </button>
                                </div>
                                {coverImageIndex === index && (
                                    <div className="absolute bottom-0 w-full bg-teal-600/80 text-white text-xs text-center py-0.5 rounded-b-md font-semibold">
                                        {t.coverPhoto}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>

        {/* Video Upload Section */}
        <div>
            <label className={formLabelStyle}>{t.uploadVideo}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a video</span>
                            <input id="video-upload" name="video-upload" type="file" className="sr-only" onChange={handleVideoChange} accept="video/*" />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">MP4, WEBM up to 50MB</p>
                </div>
            </div>
            {video && 
                <div className="mt-4">
                    <p className={formLabelStyle}>{t.videoPreview}</p>
                    <div className="relative mt-2 inline-block">
                        <video src={video} controls className="w-full max-w-sm rounded-lg" />
                        <button type="button" onClick={removeVideo} className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700">
                           <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            }
        </div>


        <div>
            <label htmlFor="details" className={formLabelStyle}>{t.details}</label>
            <textarea
                id="details"
                placeholder={t.details}
                value={details[language] || ''}
                onChange={e => handleMultilingualChange(setDetails, language, e.target.value)}
                rows={4}
                className={formInputStyle}
                dir={isRtl ? 'rtl' : 'ltr'}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className={formLabelStyle}>{t.mobileNumber}</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={formInputStyle} required dir="ltr" />
          </div>
          <div>
            <label htmlFor="location" className={formLabelStyle}>{t.locationOnMap}</label>
            <div className="flex items-center gap-2 mt-1">
                 <input
                    id="location"
                    type="text"
                    placeholder={t.locationOnMap}
                    value={location[language] || ''}
                    onChange={e => handleMultilingualChange(setLocation, language, e.target.value)}
                    className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    dir={isRtl ? 'rtl' : 'ltr'}
                />
                <button
                    type="button"
                    onClick={() => {
                        const query = location[language] || 'Kurdistan';
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    aria-label={t.viewOnMap}
                >
                    <MapPinIcon className="h-5 w-5 me-2 text-gray-500" />
                    <span>{t.viewOnMap}</span>
                </button>
            </div>
          </div>
        </div>

        <fieldset className="p-4 border rounded-md">
            <legend className="px-2 font-bold text-gray-800">{t.adType}</legend>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center">
                    <input id="normal" name="adType" type="radio" value={AdType.Normal} checked={adType === AdType.Normal} onChange={e => setAdType(e.target.value as AdType)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    <label htmlFor="normal" className="ms-3 block text-sm font-medium text-gray-700">{t.normal}</label>
                </div>
                <div className="flex items-center">
                    <input id="special" name="adType" type="radio" value={AdType.Special} checked={adType === AdType.Special} onChange={e => setAdType(e.target.value as AdType)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    <label htmlFor="special" className="ms-3 block text-sm font-medium text-gray-700">{t.special}</label>
                </div>
            </div>
        </fieldset>

        {adType === AdType.Special && (
          <fieldset className="p-4 border rounded-md bg-blue-50 animate-fade-in">
              <legend className="px-2 font-bold text-gray-800">{t.specialAdType}</legend>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center">
                  <input id="ticker" name="specialAdType" type="radio" value={SpecialAdType.Ticker} checked={specialAdType === SpecialAdType.Ticker} onChange={e => setSpecialAdType(e.target.value as SpecialAdType)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="ticker" className="ms-3 block text-sm font-medium text-gray-700">{t.ticker}</label>
                </div>
                <div className="flex items-center">
                  <input id="main_page" name="specialAdType" type="radio" value={SpecialAdType.MainPage} checked={specialAdType === SpecialAdType.MainPage} onChange={e => setSpecialAdType(e.target.value as SpecialAdType)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                  <label htmlFor="main_page" className="ms-3 block text-sm font-medium text-gray-700">{t.mainPage}</label>
                </div>
              </div>
              {specialAdType === SpecialAdType.Ticker && (
                  <div className="mt-4">
                      <label htmlFor="tickerText" className={formLabelStyle}>{t.tickerText}</label>
                       <input
                            id="tickerText"
                            type="text"
                            placeholder={t.tickerText}
                            value={tickerText[language] || ''}
                            onChange={e => handleMultilingualChange(setTickerText, language, e.target.value)}
                            className={formInputStyle}
                            dir={isRtl ? 'rtl' : 'ltr'}
                        />
                  </div>
              )}
          </fieldset>
        )}

        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {t.submit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntryForm;