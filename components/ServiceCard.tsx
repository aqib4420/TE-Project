import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="group block h-full">
      <div className="bg-theme-card rounded-2xl shadow-sm border border-theme-border overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 hover:scale-[1.02] hover:border-premium-royal/30 relative z-0 hover:z-10">
        
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-theme-main">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
          />
          
          {/* Hover Overlay with Action */}
          <div className="absolute inset-0 bg-gradient-to-t from-premium-royal/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
             <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 text-white font-bold">
               View Service <ArrowRight className="w-5 h-5 animate-pulse" />
             </div>
          </div>

          <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide shadow-sm">
            {service.category.split(' ')[0]}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
             <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-xs">{service.rating}</span>
             </div>
             <span className="text-theme-muted text-xs font-medium">({service.reviewCount} reviews)</span>
          </div>
          
          <h3 className="font-bold text-lg text-theme-text mb-2 line-clamp-2 group-hover:text-premium-royal transition-colors duration-300">
            {service.title}
          </h3>
          
          <p className="text-theme-muted text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-theme-border mt-auto group-hover:border-premium-royal/10 transition-colors">
             <div className="flex items-center gap-1.5 text-theme-muted text-xs font-medium">
                <Clock className="w-3.5 h-3.5 group-hover:text-premium-royal transition-colors" />
                {service.deliveryTime}
             </div>
             <div className="text-right">
                <span className="text-[10px] text-theme-muted block uppercase tracking-wider">Starting at</span>
                <span className="text-xl font-bold text-theme-text group-hover:text-premium-royal transition-colors">${service.price}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
