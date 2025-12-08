
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Users, ShoppingBag, DollarSign, Settings, 
  Plus, Edit, Trash2, Search, Upload, CheckCircle, XCircle, X, User as UserIcon, Calendar, FileText, Palette, Globe,
  MessageSquare, Star, Send, Paperclip, Download, Layout
} from 'lucide-react';
import { Service, Order, User, Category, DirectMessage, SiteReview } from '../types';

interface AdminDashboardProps {
  user: User;
  services: Service[];
  orders: Order[];
  users: User[]; // Registered users list
  messages: DirectMessage[]; // Global messages
  reviews: SiteReview[]; // Global reviews
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onAddService: (service: Service) => void;
  onUpdateOrder: (id: string, status: Order['status'], deliverables?: string) => void;
  appName: string;
  onUpdateAppName: (name: string) => void;
  onSendMessage: (receiverId: string, text: string, attachment?: string) => void;
  onMarkAsRead: (senderId: string) => void;
  onDeleteReview: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  services,
  orders,
  users,
  messages,
  reviews,
  onUpdateService,
  onDeleteService,
  onAddService,
  onUpdateOrder,
  appName,
  onUpdateAppName,
  onSendMessage,
  onMarkAsRead,
  onDeleteReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'orders' | 'users' | 'messages' | 'reviews' | 'settings'>('overview');
  const [isEditingService, setIsEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null); // State for file upload
  
  // Messages State
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Search State for Orders
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Settings State
  const [tempAppName, setTempAppName] = useState(appName);
  
  // Initialize color states from localStorage to ensure Hex format for input[type="color"]
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('primaryColor') || '#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState(localStorage.getItem('secondaryColor') || '#8b5cf6');
  const [borderColor, setBorderColor] = useState(localStorage.getItem('borderColor') || '#e5e7eb');
  const [cardBgColor, setCardBgColor] = useState(localStorage.getItem('cardBgColor') || '#ffffff');

  // Sync app name state when prop changes
  useEffect(() => {
    setTempAppName(appName);
  }, [appName]);

  // Reset delivery file when selected order changes
  useEffect(() => {
    if (selectedOrder) {
        setDeliveryFile(null);
    }
  }, [selectedOrder]);

  // Stats Calculation
  const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
  const pendingOrders = orders.filter(o => o.status === 'active' || o.status === 'pending').length;
  const totalClients = users.filter(u => u.role === 'client').length;

  // New Service Form State
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    category: Category.DEV,
    price: 0,
    description: '',
    fullDescription: '',
    deliveryTime: '',
    image: 'https://picsum.photos/seed/new/800/600',
    features: []
  });

  // Filter Orders Logic
  const filteredOrders = orders.filter(order => {
    const searchLower = orderSearchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.serviceTitle.toLowerCase().includes(searchLower) ||
      (order.clientName && order.clientName.toLowerCase().includes(searchLower)) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  // Group messages by user to show chat list
  const chats = React.useMemo(() => {
    const chatMap = new Map<string, DirectMessage>();
    messages.forEach(msg => {
      // Logic: If I am admin, the "other" is either sender or receiver who is NOT admin
      const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      if (otherId === user.id) return; 
      chatMap.set(otherId, msg); 
    });
    
    // Convert to user objects
    const chatUsers: User[] = [];
    chatMap.forEach((_, userId) => {
        const u = users.find(user => user.id === userId);
        if (u) chatUsers.push(u);
    });
    return chatUsers;
  }, [messages, users, user.id]);

  useEffect(() => {
    if (activeTab === 'messages' && selectedChatUser) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChatUser, activeTab]);

  const handleSaveService = () => {
    if (isEditingService) {
      onUpdateService({ ...isEditingService, ...formData } as Service);
    } else {
      const newService: Service = {
        id: `s${Date.now()}`,
        rating: 0,
        reviewCount: 0,
        reviews: [],
        ...formData
      } as Service;
      onAddService(newService);
    }
    setIsEditingService(null);
    setIsAddingService(false);
    setFormData({});
  };

  const getClientDetails = (clientName?: string) => {
    return users.find(u => u.name === clientName);
  };

  const adjustColor = (color: string, amount: number) => {
    if (!color.startsWith('#')) return color;
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const handleUpdateSettings = () => {
    onUpdateAppName(tempAppName);
    // Update CSS variables for live preview
    const root = document.documentElement;
    root.style.setProperty('--color-primary-500', primaryColor);
    root.style.setProperty('--color-primary-600', adjustColor(primaryColor, -20));
    root.style.setProperty('--color-secondary-500', secondaryColor);
    root.style.setProperty('--color-secondary-600', adjustColor(secondaryColor, -20));
    root.style.setProperty('--border-color', borderColor);
    root.style.setProperty('--bg-card', cardBgColor);
    
    // Save to localStorage for persistence
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('borderColor', borderColor);
    localStorage.setItem('cardBgColor', cardBgColor);
    
    alert("Settings updated successfully!");
  };

  const handleSendAdminMessage = () => {
    if (!chatInput.trim() || !selectedChatUser) return;
    onSendMessage(selectedChatUser.id, chatInput);
    setChatInput('');
  };

  const handleSendFile = () => {
     if (!selectedChatUser) return;
     const fakeFile = "https://example.com/delivery_v1.zip";
     onSendMessage(selectedChatUser.id, "I have attached the completed project files. Please review.", fakeFile);
  };

  // If role is strictly checked in App.tsx, this is a fallback
  if (user?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }
  
  // Accurately calculate unread messages sent TO the admin
  const unreadMessageCount = messages.filter(m => !m.isRead && m.receiverId === user.id).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-premium-royal mb-2">Admin Portal</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Management</p>
        </div>
        <nav className="mt-4 space-y-1 px-4 flex-1 overflow-y-auto">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <BarChart className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <ShoppingBag className="w-5 h-5" /> Orders
          </button>
          
          {/* Messages Link with Real-time Notification Badge */}
          <button onClick={() => setActiveTab('messages')} className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'messages' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" /> Messages
            </div>
            {unreadMessageCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                {unreadMessageCount}
              </span>
            )}
          </button>

           <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'reviews' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <Star className="w-5 h-5" /> Reviews
          </button>
          <button onClick={() => setActiveTab('services')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'services' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <Settings className="w-5 h-5" /> Services
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
            <Users className="w-5 h-5" /> Users
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
             <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-premium-royal dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}>
               <Palette className="w-5 h-5" /> Settings
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center p-8 pb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600"><DollarSign className="w-6 h-6" /></div>
                    <span className="text-xs font-bold text-green-500">+12%</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600"><ShoppingBag className="w-6 h-6" /></div>
                    <span className="text-xs font-bold text-orange-500">{pendingOrders} pending</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600"><Users className="w-6 h-6" /></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Clients</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalClients}</h3>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600"><Star className="w-6 h-6" /></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</h3>
                </div>
                </div>
            </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
            <div>
                <div className="flex justify-end mb-6">
                <button 
                    onClick={() => { setIsAddingService(true); setFormData({}); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-premium-royal to-premium-indigo text-white px-4 py-2 rounded-full hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all"
                >
                    <Plus className="w-5 h-5" /> Add New Service
                </button>
                </div>
                
                {(isAddingService || isEditingService) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                    <h3 className="text-xl font-bold mb-4">{isEditingService ? 'Edit Service' : 'Add New Service'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input 
                            type="text" placeholder="Title" 
                            value={formData.title || ''}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                        />
                        <input 
                            type="number" placeholder="Price" 
                            value={formData.price || ''}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" 
                        />
                        <textarea 
                            placeholder="Description" 
                            value={formData.description || ''}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="p-2 border rounded-lg md:col-span-2 dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSaveService} className="bg-gradient-to-r from-premium-royal to-premium-indigo text-white px-4 py-2 rounded-full hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all">Save</button>
                        <button onClick={() => { setIsAddingService(false); setIsEditingService(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600">Cancel</button>
                    </div>
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
                    <div className="relative h-48">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setIsEditingService(service); setFormData(service); }} className="p-2 bg-white rounded-full shadow text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteService(service.id)} className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{service.title}</h3>
                        <p className="text-premium-royal font-bold mt-2">${service.price}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Service, Client, or Status..." 
                            value={orderSearchTerm}
                            onChange={(e) => setOrderSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-premium-royal outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <tr 
                                    key={order.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{order.id.slice(-6)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.serviceTitle}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.clientName || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${order.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                            title="Mark Completed"
                                            onClick={(e) => { e.stopPropagation(); onUpdateOrder(order.id, 'completed', 'http://files.com/delivery.zip'); }}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                            >
                                            <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button 
                                            title="Cancel Order"
                                            onClick={(e) => { e.stopPropagation(); onUpdateOrder(order.id, 'cancelled'); }}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                            >
                                            <XCircle className="w-5 h-5" />
                                            </button>
                                            <button 
                                            title="Upload Files"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                            <Upload className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No orders found matching "{orderSearchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-[600px] flex">
                    {/* Chat List */}
                    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Chats</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {chats.length > 0 ? chats.map(chatUser => {
                                const userUnreadCount = messages.filter(m => !m.isRead && m.senderId === chatUser.id && m.receiverId === user.id).length;
                                return (
                                    <div 
                                        key={chatUser.id}
                                        onClick={() => { setSelectedChatUser(chatUser); onMarkAsRead(chatUser.id); }}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedChatUser?.id === chatUser.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={chatUser.avatar} alt={chatUser.name} className="w-10 h-10 rounded-full" />
                                                {userUnreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
                                                        {userUnreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{chatUser.name}</p>
                                                <p className="text-xs text-gray-500">Client</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-4 text-center text-gray-500">No active chats</div>
                            )}
                        </div>
                    </div>

                    {/* Chat View */}
                    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
                        {selectedChatUser ? (
                            <>
                                {/* Header */}
                                <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedChatUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <h3 className="font-bold text-gray-900 dark:text-white">{selectedChatUser.name}</h3>
                                    </div>
                                    <button 
                                      onClick={handleSendFile}
                                      className="flex items-center gap-2 text-sm text-premium-royal bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                                    >
                                        <Paperclip className="w-4 h-4" /> Send File
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages
                                        .filter(m => (m.senderId === selectedChatUser.id && m.receiverId === user.id) || (m.senderId === user.id && m.receiverId === selectedChatUser.id))
                                        .map(msg => {
                                            const isMe = msg.senderId === user.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-premium-royal to-premium-indigo text-white rounded-br-none' : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-bl-none text-gray-800 dark:text-gray-200'}`}>
                                                        {msg.attachment && (
                                                            <a href={msg.attachment} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-2 rounded-xl mb-2 transition-colors border group ${
                                                                isMe 
                                                                  ? 'bg-blue-700/50 border-blue-500/30 hover:bg-blue-700' 
                                                                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                              }`}>
                                                                <div className={`p-1.5 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white dark:bg-gray-800 text-premium-royal'}`}>
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 pr-2">
                                                                    <p className="text-xs font-bold truncate">Attachment</p>
                                                                    <p className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>Click to download</p>
                                                                </div>
                                                                <Download className={`w-4 h-4 ${isMe ? 'text-blue-100' : 'text-gray-400'}`} />
                                                            </a>
                                                        )}
                                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    <div ref={chatEndRef}></div>
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendAdminMessage()}
                                        placeholder="Type your reply..."
                                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 focus:ring-2 focus:ring-premium-royal text-gray-900 dark:text-gray-100"
                                    />
                                    <button 
                                      onClick={handleSendAdminMessage}
                                      className="p-2 bg-gradient-to-r from-premium-royal to-premium-indigo text-white rounded-full hover:shadow-[0_0_15px_rgba(6,214,160,0.5)] transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                                <p>Select a chat to view messages</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                             <h3 className="text-xl font-bold">Manage Reviews</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {reviews.map(review => (
                                <div key={review.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <img src={review.userAvatar} alt="" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{review.userName}</h4>
                                                <span className="text-xs text-gray-500">{review.date}</span>
                                            </div>
                                        </div>
                                        <button 
                                          onClick={() => {
                                              if(window.confirm("Are you sure you want to delete this review?")) {
                                                  onDeleteReview(review.id);
                                              }
                                          }}
                                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">"{review.comment}"</p>
                                </div>
                            ))}
                            {reviews.length === 0 && <p className="p-6 text-center text-gray-500">No reviews found.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg">Registered Users</h3>
                </div>
                <div className="p-6 grid gap-4">
                    {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-4">
                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {u.role}
                            </span>
                        </div>
                    ))}
                    {users.length === 0 && <p className="text-gray-500">No users registered yet.</p>}
                </div>
            </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">General Settings</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website Name</label>
                        <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">
                            <Globe className="w-4 h-4" />
                        </span>
                        <input 
                            type="text" 
                            value={tempAppName} 
                            onChange={(e) => setTempAppName(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-premium-royal focus:border-premium-royal sm:text-sm transition-colors"
                            placeholder="My Awesome Marketplace"
                        />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">This will update the brand name across the entire site.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={primaryColor} 
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 font-mono">{primaryColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={secondaryColor} 
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 font-mono">{secondaryColor}</span>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Border Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={borderColor} 
                                    onChange={(e) => setBorderColor(e.target.value)}
                                    className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 font-mono">{borderColor}</span>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Background</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={cardBgColor} 
                                    onChange={(e) => setCardBgColor(e.target.value)}
                                    className="h-10 w-20 p-1 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 font-mono">{cardBgColor}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button 
                        onClick={handleUpdateSettings}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-royal transition-all"
                        >
                        Save Changes
                        </button>
                    </div>
                </div>
            </div>
            )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h3>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div>
                             <p className="text-sm text-gray-500 uppercase tracking-wide">Order ID</p>
                             <p className="font-mono text-gray-900 dark:text-white font-medium">#{selectedOrder.id}</p>
                        </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            selectedOrder.status === 'completed' ? 'bg-green-100 text-green-700' :
                            selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                         }`}>
                            {selectedOrder.status}
                         </span>
                    </div>

                    {/* Service Info */}
                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <img src={selectedOrder.serviceImage} alt="" className="w-20 h-20 rounded-lg object-cover" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase mb-1">Service</p>
                            <h4 className="font-bold text-gray-900 dark:text-white">{selectedOrder.serviceTitle}</h4>
                            <p className="text-premium-royal font-bold mt-1">${selectedOrder.price}</p>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                                <UserIcon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Client</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.clientName || 'Unknown'}</p>
                            {(() => {
                                const client = getClientDetails(selectedOrder.clientName);
                                return client ? <p className="text-sm text-gray-500">{client.email}</p> : null;
                            })()}
                        </div>
                        <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                            <div className="flex items-center gap-2 mb-2 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Date Placed</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.date}</p>
                        </div>
                    </div>

                    {/* Deliverables Upload Section */}
                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Attach Delivery Files</h4>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                <Upload className="w-4 h-4 text-premium-royal" /> 
                                {deliveryFile ? 'Replace File' : 'Upload File'}
                                <input 
                                    type="file" 
                                    className="hidden"
                                    onChange={(e) => e.target.files && setDeliveryFile(e.target.files[0])}
                                />
                            </label>
                            {deliveryFile ? (
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="truncate max-w-[150px]">{deliveryFile.name}</span>
                                    <button onClick={() => setDeliveryFile(null)} className="ml-1 text-gray-400 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400 italic">No file selected</span>
                            )}
                        </div>
                        {selectedOrder.deliverables && !deliveryFile && (
                            <div className="mt-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Files already delivered
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer (Actions) */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                     <button 
                        onClick={() => { onUpdateOrder(selectedOrder.id, 'cancelled'); setSelectedOrder(null); }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-full font-medium transition-colors"
                     >
                        Cancel Order
                     </button>
                     <button 
                        onClick={() => { 
                             // Use simulated URL if file selected, otherwise keep existing
                             const fileUrl = deliveryFile 
                                ? `https://storage.myapp.com/deliveries/${Date.now()}_${deliveryFile.name}` 
                                : selectedOrder.deliverables;
                             
                             onUpdateOrder(selectedOrder.id, 'completed', fileUrl); 
                             setSelectedOrder(null); 
                        }}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-full font-medium transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2"
                     >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed & Send
                     </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
