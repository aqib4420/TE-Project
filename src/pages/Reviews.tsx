import React, { useState } from 'react';
import { Star, ThumbsUp, User as UserIcon } from 'lucide-react';
import { SiteReview, User } from '../types';

interface ReviewsPageProps {
  user: User | null;
  reviews: SiteReview[];
  onAddReview: (rating: number, comment: string) => void;
}

export const Reviews: React.FC<ReviewsPageProps> = ({ user, reviews, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddReview(rating, comment);
      setComment('');
      setRating(5);
      alert("Thank you for your review!");
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="bg-theme-main min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
            <div className="flex justify-center items-center gap-3">
                <span className="text-5xl font-bold text-yellow-400">{averageRating}</span>
                <div className="flex flex-col items-start">
                    <div className="flex text-yellow-400 text-lg">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-gray-600'}`} />
                        ))}
                    </div>
                    <span className="text-gray-400 text-sm">{reviews.length} Verified Reviews</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Reviews List */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-theme-text mb-6">What people are saying</h2>
            {reviews.length === 0 && <p className="text-theme-muted">No reviews yet. Be the first!</p>}
            {reviews.map(review => (
                <div key={review.id} className="bg-theme-card p-6 rounded-2xl shadow-sm border border-theme-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full border border-gray-200" />
                            <div>
                                <h4 className="font-bold text-theme-text">{review.userName}</h4>
                                <span className="text-xs text-theme-muted">{review.date}</span>
                            </div>
                        </div>
                        <div className="flex text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                             ))}
                        </div>
                    </div>
                    <p className="text-theme-muted leading-relaxed mb-4">"{review.comment}"</p>
                    <div className="flex items-center gap-2 text-xs text-theme-muted cursor-pointer hover:text-premium-royal">
                        <ThumbsUp className="w-4 h-4" /> Helpful
                    </div>
                </div>
            ))}
         </div>

         {/* Submission Form */}
         <div className="lg:col-span-1">
             <div className="bg-theme-card p-6 rounded-2xl shadow-lg border border-theme-border sticky top-28">
                 <h3 className="text-xl font-bold text-theme-text mb-2">Write a Review</h3>
                 <p className="text-theme-muted text-sm mb-6">Share your experience with us.</p>
                 
                 {user ? (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-theme-text mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star 
                                            className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-theme-text mb-2">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows={4}
                                placeholder="Tell us about your experience..."
                                className="w-full px-4 py-3 bg-theme-input text-theme-text border border-theme-border rounded-xl focus:ring-2 focus:ring-premium-royal focus:border-transparent outline-none resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-premium-royal to-premium-indigo text-white font-bold py-3 rounded-full hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all shadow-lg"
                        >
                            Submit Review
                        </button>
                     </form>
                 ) : (
                     <div className="text-center py-8">
                         <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                             <UserIcon className="w-8 h-8 text-gray-400" />
                         </div>
                         <p className="text-theme-muted mb-4">Please log in to submit a review.</p>
                         <a href="/login" className="block w-full bg-gradient-to-r from-premium-royal to-premium-indigo text-white font-bold py-3 rounded-full hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all text-center">
                             Log In / Register
                         </a>
                     </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};