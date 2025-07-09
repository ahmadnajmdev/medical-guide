import React, { useState } from 'react';
import { Entry, Category } from '../types';
import { useLanguage } from '../App';
import { PhoneIcon, MapPinIcon, ArrowLeftIcon, WhatsAppIcon } from './icons';

interface DetailPageProps {
  item: Entry;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({ item, onBack }) => {
  const { t, language } = useLanguage();
  // Initialize the gallery with the selected cover image
  const [currentImageIndex, setCurrentImageIndex] = useState(item.coverImageIndex || 0);

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location[language])}`;
  const whatsappUrl = `https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`;

  const hasMedia = item.images && item.images.length > 0;
  const currentImage = hasMedia ? item.images[currentImageIndex] : 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
            <ArrowLeftIcon className="w-5 h-5 me-2 transform rtl:rotate-180" />
            {t.backToList}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Media Section */}
          <div className="md:col-span-1 bg-gray-100 p-4">
            <div className="sticky top-24">
              <img className="h-64 w-full object-cover rounded-lg shadow-md mb-4" src={currentImage} alt={`${item.name[language]} - ${currentImageIndex + 1}`} />
              {item.images && item.images.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {item.images.map((img, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)}>
                      <img 
                        src={img} 
                        alt={`thumbnail ${index + 1}`}
                        className={`h-16 w-16 object-cover rounded-md cursor-pointer transition-all duration-200 ${currentImageIndex === index ? 'ring-4 ring-blue-500' : 'hover:scale-105'}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Info Section */}
          <div className="md:col-span-2 p-8">
            <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">{t[item.category]}</div>
            <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black">{item.name[language]}</h1>
            <p className="mt-4 text-gray-600">{item.details[language]}</p>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.details}</h3>
              <div className="space-y-4">
                 <div className="flex items-center text-gray-700">
                    <PhoneIcon className="w-6 h-6 me-3 text-gray-400" />
                    <span className="font-medium">{t.phone}:</span>
                    <span className="ms-2">{item.phone}</span>
                 </div>
                 <div className="flex items-center text-gray-700">
                    <MapPinIcon className="w-6 h-6 me-3 text-gray-400" />
                    <span className="font-medium">{t.location}:</span>
                     <span className="ms-2">{item.location[language]}</span>
                 </div>
                 <div className="flex flex-wrap gap-4 pt-4">
                     <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <MapPinIcon className="w-5 h-5 me-2" />
                        {t.viewOnMap}
                     </a>
                     {item.category === Category.Doctors && (
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400">
                            <WhatsAppIcon className="w-5 h-5 me-2" />
                            {t.bookAppointment}
                        </a>
                     )}
                 </div>
              </div>
            </div>
          </div>
        </div>
         {/* Video Section */}
         {item.video && (
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
             <h3 className="text-xl font-bold text-gray-800 mb-4">{t.videoPreview}</h3>
             <video src={item.video} controls className="w-full max-w-2xl mx-auto rounded-lg shadow-md">
                Your browser does not support the video tag.
             </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;