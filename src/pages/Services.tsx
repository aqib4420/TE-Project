import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { MOCK_SERVICES } from '../constants';
import { Category } from '../types';

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(Category)];

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-theme-main min-h-screen pb-20">
      <div className="bg-gray-900 text-white py-12 mb-8">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-4">Explore Services</h1>
            <p className="text-gray-400 max-w-2xl">Browse our catalog of expert services. Filter by category or search to find exactly what you need.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-theme-card p-4 rounded-xl shadow-sm border border-theme-border mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-theme-input text-theme-text border border-theme-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-5 h-5 text-theme-muted flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-premium-royal to-premium-indigo text-white shadow-[0_0_15px_rgba(6,214,160,0.5)] transform scale-105' 
                    : 'bg-theme-main text-theme-muted hover:bg-theme-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-theme-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-theme-border">
               <Search className="w-8 h-8 text-theme-muted" />
            </div>
            <h3 className="text-xl font-bold text-theme-text mb-2">No services found</h3>
            <p className="text-theme-muted">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};