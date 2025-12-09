import React from 'react';
import { Package, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { User, Order } from '../types';

interface DashboardProps {
  user: User;
  orders: Order[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, orders }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-6 mb-10">
         <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-theme-card shadow-lg" />
         <div>
            <h1 className="text-3xl font-bold text-theme-text">Welcome, {user.name}</h1>
            <p className="text-theme-muted">Manage your orders and account settings.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
            <div className="text-theme-muted text-sm font-medium uppercase mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-theme-text">{orders.length}</div>
         </div>
         <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
            <div className="text-theme-muted text-sm font-medium uppercase mb-2">Active Orders</div>
            <div className="text-3xl font-bold text-primary-600">
               {orders.filter(o => o.status === 'active').length}
            </div>
         </div>
         <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
             <div className="text-theme-muted text-sm font-medium uppercase mb-2">Completed</div>
             <div className="text-3xl font-bold text-green-600">
               {orders.filter(o => o.status === 'completed').length}
             </div>
         </div>
         <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
             <div className="text-theme-muted text-sm font-medium uppercase mb-2">Total Spent</div>
             <div className="text-3xl font-bold text-theme-text">
               ${orders.reduce((acc, curr) => acc + curr.price, 0)}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-theme-text">My Orders</h2>
          {orders.length > 0 ? (
             <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-theme-main border-b border-theme-border">
                         <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-theme-muted uppercase">Service</th>
                            <th className="px-6 py-4 text-xs font-semibold text-theme-muted uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-theme-muted uppercase">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-theme-muted uppercase">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-border">
                         {orders.map(order => (
                            <tr key={order.id} className="hover:bg-theme-main transition-colors">
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                     <img src={order.serviceImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                     <span className="font-medium text-theme-text">{order.serviceTitle}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-theme-muted text-sm">{order.date}</td>
                               <td className="px-6 py-4 font-medium text-theme-text">${order.price}</td>
                               <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                     order.status === 'active' 
                                     ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                                     : order.status === 'completed'
                                     ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                                     : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                     {order.status === 'active' && <Clock className="w-3 h-3" />}
                                     {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          ) : (
             <div className="text-center py-16 bg-theme-card rounded-xl border border-theme-border border-dashed">
                <Package className="w-12 h-12 text-theme-muted mx-auto mb-4" />
                <p className="text-theme-muted">You haven't placed any orders yet.</p>
             </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-xl font-bold text-theme-text">Recent Messages</h2>
           <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border p-4 space-y-4">
              {/* Mock Messages */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                 <div className="relative">
                    <img src="https://picsum.photos/seed/u1/40/40" alt="Support" className="w-10 h-10 rounded-full" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-sm text-theme-text">Support Team</h4>
                       <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">New</span>
                    </div>
                    <p className="text-sm text-theme-muted truncate">Welcome to TeachReach! Let us know if you need help.</p>
                 </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                 <div className="relative">
                    <img src="https://picsum.photos/seed/design1/40/40" alt="Aqib" className="w-10 h-10 rounded-full" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-sm text-theme-text">System</h4>
                       <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">New</span>
                    </div>
                    <p className="text-sm text-theme-muted truncate">Your profile has been successfully updated.</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                 <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="font-bold text-sm text-theme-text">Offer</h4>
                       <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">New</span>
                    </div>
                    <p className="text-sm text-theme-muted truncate">10% discount on your first order available!</p>
                 </div>
              </div>

              <button className="w-full py-2 text-sm text-theme-muted hover:text-primary-600 font-medium border-t border-theme-border mt-2">
                 View All Messages
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};