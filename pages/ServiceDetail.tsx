import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Check, ShieldCheck, ChevronLeft } from 'lucide-react';
import { MOCK_SERVICES } from '../constants';
import { User } from '../types';

interface ServiceDetailProps {
  user: User | null;
  onOrder: (serviceId: string) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ user, onOrder }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);
  
  const service = MOCK_SERVICES.find(s => s.id === id);

  if (!service) {
    return <div className="p-20 text-center text-theme-text">Service not found.</div>;
  }

  const handleOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsOrdering(true);
    // Simulate payment processing
    setTimeout(() => {
      onOrder(service.id);
      setIsOrdering(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-theme-muted hover:text-theme-text mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text leading-tight">
            {service.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm">
             <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-gray-900 dark:text-gray-100">{service.rating}</span>
                <span className="text-gray-500 dark:text-gray-400">({service.reviewCount} reviews)</span>
             </div>
             <div className="flex items-center gap-1.5 text-theme-muted">
                <Clock className="w-4 h-4" />
                <span>{service.deliveryTime} delivery</span>
             </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-theme-border">
            <img src={service.image} alt={service.title} className="w-full h-auto object-cover" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-theme-text mb-4">About This Service</h2>
            <p className="text-theme-muted leading-relaxed whitespace-pre-line">
              {service.fullDescription}
            </p>
          </div>

          <div>
             <h2 className="text-xl font-bold text-theme-text mb-4">Reviews</h2>
             <div className="space-y-4">
                {service.reviews.length > 0 ? service.reviews.map(review => (
                   <div key={review.id} className="border-b border-theme-border pb-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="font-semibold text-theme-text">{review.user}</span>
                         <span className="text-xs text-theme-muted">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                         {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700'}`} />
                         ))}
                      </div>
                      <p className="text-theme-muted text-sm">{review.comment}</p>
                   </div>
                )) : (
                   <p className="text-theme-muted">No reviews yet.</p>
                )}
             </div>
          </div>
        </div>

        {/* Right Sidebar (Sticky Order Card) */}
        <div className="lg:col-span-1">
          <div className="bg-theme-card rounded-2xl shadow-xl border border-theme-border p-6 sticky top-28">
            <div className="flex justify-between items-end mb-6">
              <span className="text-theme-muted font-medium">Total Price</span>
              <span className="text-4xl font-bold text-theme-text">${service.price}</span>
            </div>
            
            <p className="text-theme-muted text-sm mb-6">
              Full professional package including all deliverables listed below.
            </p>

            <div className="space-y-3 mb-8">
               {service.features.map((feature, idx) => (
                 <div key={idx} className="flex items-center gap-3 text-sm text-theme-text">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                 </div>
               ))}
            </div>

            <button
              onClick={handleOrderClick}
              disabled={isOrdering}
              className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2"
            >
              {isOrdering ? 'Processing...' : 'Continue to Order'}
            </button>
            
            <div className="mt-4 text-center">
               <button className="text-theme-muted text-sm hover:text-theme-text underline">Contact Seller</button>
            </div>

             <div className="mt-6 pt-6 border-t border-theme-border flex items-center justify-center gap-2 text-xs text-theme-muted">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure Payment</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Fake Payment Modal Overlay */}
      {isOrdering && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-theme-card p-8 rounded-2xl max-w-sm w-full text-center border border-theme-border shadow-2xl">
               <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
               <h3 className="text-lg font-bold text-theme-text mb-2">Processing Payment...</h3>
               <p className="text-theme-muted text-sm">Please wait while we secure your order.</p>
            </div>
         </div>
      )}
    </div>
  );
};