import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Reviews } from './pages/Reviews';
import { ChatWidget } from './components/ChatWidget';
import { MOCK_SERVICES, APP_NAME, MOCK_SITE_REVIEWS } from './constants';
import { User, Order, Service, DirectMessage, SiteReview } from './types';
import { Mail, Lock, User as UserIcon, Phone, X } from 'lucide-react';

const ADMIN_EMAIL = 'admin@myapp.com';

// Forgot Password Modal
const ForgotPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Password reset link sent to ${email}`);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-theme-card w-full max-w-md rounded-2xl shadow-xl border border-theme-border p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-muted hover:text-theme-text">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-theme-text mb-2">Reset Password</h3>
        <p className="text-theme-muted text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-theme-border bg-theme-input text-theme-text focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Auth Component
const AuthPage = ({ onAuth }: { onAuth: (data: any, isLogin: boolean) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onAuth(formData, isLogin);
      setLoading(false);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-main py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200 dark:bg-primary-900/40 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-200 dark:bg-secondary-900/40 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-md w-full space-y-8 bg-theme-card p-10 rounded-2xl shadow-xl relative z-10 glass">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mx-auto mb-6">
            TR
          </div>
          <h2 className="text-3xl font-extrabold text-theme-text">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-theme-muted">
            {isLogin ? 'Sign in to access your dashboard' : 'Join TeachReach to hire experts'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-sm -space-y-px">
            {!isLogin && (
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-theme-muted" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-theme-border placeholder-theme-muted text-theme-text bg-theme-input focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-theme-muted" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-theme-border placeholder-theme-muted text-theme-text bg-theme-input focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
               <div className="relative mb-4">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Phone className="h-5 w-5 text-theme-muted" />
                 </div>
                 <input
                   name="phone"
                   type="tel"
                   required
                   className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-theme-border placeholder-theme-muted text-theme-text bg-theme-input focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                   placeholder="Phone Number"
                   value={formData.phone}
                   onChange={handleChange}
                 />
               </div>
            )}

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-theme-muted" />
              </div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-theme-border placeholder-theme-muted text-theme-text bg-theme-input focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {isLogin && (
             <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                   Forgot password?
                </button>
             </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 shadow-lg transform transition-all hover:-translate-y-0.5"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>

      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </div>
  );
};

// Main App Component with Router and State
const AppContent = () => {
  // Initialize State from LocalStorage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : MOCK_SERVICES; // Seed if empty
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [siteReviews, setSiteReviews] = useState<SiteReview[]>(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [siteName, setSiteName] = useState(() => {
    return localStorage.getItem('appName') || APP_NAME;
  });

  // Auto-Save Effects
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('reviews', JSON.stringify(siteReviews)); }, [siteReviews]);
  useEffect(() => { localStorage.setItem('appName', siteName); }, [siteName]);

  const [unreadMessages] = useState(0); // For now simple static or derived later
  const navigate = useNavigate();

  const handleAuth = (data: any, isLogin: boolean) => {
    if (isLogin) {
      // 1. Find User
      const existingUser = registeredUsers.find(u => u.email === data.email);
      
      // 2. Check Admin Special Case (must exist in DB or just rule check?)
      // We will follow rule: If email is admin, role is admin. But password must match.
      
      if (!existingUser) {
        alert("Account not found. Please register first.");
        return;
      }

      if (existingUser.password !== data.password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      // 3. Successful Login
      // Enforce Admin Role Rule
      if (existingUser.email === ADMIN_EMAIL && existingUser.role !== 'admin') {
         // Auto-fix role if it drifted (shouldn't happen with updated logic below)
         existingUser.role = 'admin';
      }

      setUser(existingUser);
      if (existingUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } else {
      // REGISTER
      // 1. Check Duplicates
      if (registeredUsers.some(u => u.email === data.email)) {
        alert("This email is already registered.");
        return;
      }
      
      // 2. Determine Role
      const role = data.email === ADMIN_EMAIL ? 'admin' : 'client';
      
      const newUser: User = {
        id: `u${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: `https://picsum.photos/seed/${data.name}/100/100`,
        role: role,
        password: data.password // Save password
      };
      
      setRegisteredUsers(prev => [...prev, newUser]);
      setUser(newUser);
      
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleOrder = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service && user) {
      const newOrder: Order = {
        id: `o${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        serviceImage: service.image,
        price: service.price,
        status: 'active',
        date: new Date().toLocaleDateString(),
        clientName: user.name
      };
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  // Admin Actions
  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleAddService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleUpdateOrder = (id: string, status: Order['status'], deliverables?: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, deliverables } : o));
  };
  
  // Message Handling
  const handleSendMessage = (text: string, attachment?: string) => {
    if (!user) return;
    
    // If client sends, receiver is Admin.
    // We need to find the admin ID. For simplicity, we assume an admin exists or just use a placeholder ID if no admin is registered yet.
    // Ideally we look up the admin user.
    const adminUser = registeredUsers.find(u => u.role === 'admin');
    const receiverId = adminUser ? adminUser.id : 'admin_placeholder';

    const newMessage: DirectMessage = {
        id: `m${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        receiverId: receiverId, 
        text,
        attachment,
        timestamp: new Date(),
        isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Admin sending message
  const handleAdminSendMessage = (receiverId: string, text: string, attachment?: string) => {
      if (!user) return;
      const newMessage: DirectMessage = {
          id: `m${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          receiverId,
          text,
          attachment,
          timestamp: new Date(),
          isRead: false
      };
      setMessages(prev => [...prev, newMessage]);
  };

  // Review Handling
  const handleAddReview = (rating: number, comment: string) => {
      if(!user) return;
      const newReview: SiteReview = {
          id: `sr${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          rating,
          comment,
          date: new Date().toLocaleDateString()
      };
      setSiteReviews(prev => [newReview, ...prev]);
  };

  const handleDeleteReview = (id: string) => {
      setSiteReviews(prev => prev.filter(r => r.id !== id));
  };

  const notificationCount = orders.filter(o => o.status === 'active').length + unreadMessages;

  return (
    <>
      <Layout user={user} onLogout={handleLogout} notificationCount={notificationCount} appName={siteName}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail user={user} onOrder={handleOrder} />} />
          <Route path="/reviews" element={<Reviews user={user} reviews={siteReviews} onAddReview={handleAddReview} />} />
          
          {/* CLIENT DASHBOARD - Protected */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} orders={orders.filter(o => user.role === 'client' ? true : true)} /> : <Navigate to="/login" />} 
          />

          {/* ADMIN DASHBOARD - Strictly Protected */}
          <Route 
            path="/admin-dashboard" 
            element={
              user?.role === 'admin' ? (
                <AdminDashboard 
                  user={user} 
                  services={services} 
                  orders={orders}
                  users={registeredUsers}
                  messages={messages}
                  reviews={siteReviews}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                  onAddService={handleAddService}
                  onUpdateOrder={handleUpdateOrder}
                  appName={siteName}
                  onUpdateAppName={setSiteName}
                  onSendMessage={handleAdminSendMessage}
                  onDeleteReview={handleDeleteReview}
                />
              ) : (
                <Navigate to={user ? "/dashboard" : "/login"} replace />
              )
            } 
          />
          
          <Route path="/login" element={<AuthPage onAuth={handleAuth} />} />
          <Route path="/register" element={<AuthPage onAuth={handleAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <ChatWidget user={user} messages={messages} onSendMessage={handleSendMessage} />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}