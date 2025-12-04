import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="group block h-full">
      <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
        <div className="relative aspect-video overflow-hidden bg-theme-main">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {service.category.split(' ')[0]}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
             <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm">{service.rating}</span>
             </div>
             <span className="text-theme-muted text-sm">({service.reviewCount})</span>
          </div>
          
          <h3 className="font-semibold text-theme-text mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {service.title}
          </h3>
          
          <p className="text-theme-muted text-sm line-clamp-3 mb-4 flex-grow">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-theme-border mt-auto">
             <div className="flex items-center gap-1.5 text-theme-muted text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {service.deliveryTime}
             </div>
             <div className="text-right">
                <span className="text-xs text-theme-muted block uppercase">Starting at</span>
                <span className="text-lg font-bold text-theme-text">${service.price}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};