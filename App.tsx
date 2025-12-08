
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Reviews } from './pages/Reviews';
import { UserSettings } from './pages/UserSettings';
import { ChatWidget } from './components/ChatWidget';
import { VerificationModal } from './components/VerificationModal';
import { MOCK_SERVICES, APP_NAME } from './constants';
import { User, Order, Service, DirectMessage, SiteReview, CheckoutData } from './types';
import { Mail, Lock, User as UserIcon, Phone, X, AlertCircle } from 'lucide-react';
import { supabase } from './services/supabaseClient';

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
              className="w-full px-4 py-2 rounded-lg border border-theme-border bg-theme-input text-theme-text focus:ring-2 focus:ring-premium-royal outline-none"
              placeholder="you@example.com"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-premium-royal to-premium-indigo text-white py-2 rounded-full font-medium hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Auth Component
const AuthPage = ({ onAuth }: { onAuth: (data: any, isLogin: boolean) => string | void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState(''); // New state for error message
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(''); // Clear previous errors on submit attempt

    // Simulate API delay
    setTimeout(() => {
      const error = onAuth(formData, isLogin);
      if (error) {
        setLoginError(error);
      }
      setLoading(false);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginError(''); // Auto-clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-main py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200 dark:bg-primary-900/40 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-200 dark:bg-secondary-900/40 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-md w-full space-y-8 bg-theme-card p-10 rounded-3xl shadow-2xl relative z-10 glass border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mx-auto mb-6">
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
          {/* Form Fields Container with Spacing */}
          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {!isLogin && (
               <div>
                 <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Phone Number</label>
                 <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Phone className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                   </div>
                   <input
                     name="phone"
                     type="tel"
                     required
                     className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                     placeholder="+1 234 567 890"
                     value={formData.phone}
                     onChange={handleChange}
                   />
                 </div>
               </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* INLINE ERROR MESSAGE */}
          {loginError && (
            <div className="mt-4 bg-[#ffe6e6] text-[#d00000] px-4 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4" />
              {loginError}
            </div>
          )}

          {isLogin && (
             <div className="flex justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-premium-royal hover:text-premium-indigo hover:underline transition-all"
                >
                   Forgot password?
                </button>
             </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-royal disabled:opacity-50 shadow-lg transform transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setLoginError(''); }}
              className="text-sm font-medium text-theme-muted hover:text-premium-royal transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="font-bold text-premium-royal underline ml-1">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-bold text-premium-royal underline ml-1">Sign in</span></>
              )}
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
    // Initial load from local storage, but useEffect will fetch from Supabase
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

  // Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  // Auto-Save Effects (Local Storage)
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('reviews', JSON.stringify(siteReviews)); }, [siteReviews]);
  useEffect(() => { localStorage.setItem('appName', siteName); }, [siteName]);

  // SUPABASE: Fetch Orders on Mount
  useEffect(() => {
    const fetchOrders = async () => {
      // Note: We need to map Supabase columns back to our App Order type if names differ
      // For simplicity, we assume the dashboard only needs basic fields or we map them here
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching orders from Supabase:', error);
      } else if (data) {
        // Simple mapping if needed, otherwise cast
        const mappedOrders = data.map((d: any) => ({
             id: d.id.toString(),
             serviceId: 'unknown',
             serviceTitle: d.product_name || 'Service',
             serviceImage: 'https://picsum.photos/seed/order/100/100',
             price: d.total_amount || 0,
             status: d.status || 'active',
             date: new Date(d.created_at).toLocaleDateString(),
             clientName: `${d.first_name} ${d.last_name}`
        })) as Order[];
        
        setOrders(mappedOrders);
        localStorage.setItem('orders', JSON.stringify(mappedOrders));
      }
    };

    fetchOrders();
  }, []);

  // Calculate unread messages dynamically
  const unreadMessagesCount = user 
    ? messages.filter(m => !m.isRead && m.receiverId === user.id).length
    : 0;
    
  const navigate = useNavigate();

  // Updated to return string errors instead of alerts
  const handleAuth = (data: any, isLogin: boolean): string | void => {
    if (isLogin) {
      // 1. Find User
      const existingUser = registeredUsers.find(u => u.email === data.email);
      
      if (!existingUser) {
        return "Account does not exist. Please register first.";
      }

      if (existingUser.password !== data.password) {
        return "Incorrect password. Please try again.";
      }

      // Check Verification
      if (!existingUser.isVerified) {
          // If not verified, trigger verification flow again
          setPendingVerificationEmail(existingUser.email);
          const newCode = Math.floor(1000 + Math.random() * 9000).toString();
          
          // Update the user's code in DB
          const updatedUsers = registeredUsers.map(u => 
             u.email === existingUser.email ? { ...u, verificationCode: newCode } : u
          );
          setRegisteredUsers(updatedUsers);
          
          setShowVerifyModal(true);
          // Return generic message but modal handles the rest
          return "Please verify your email before logging in."; 
      }

      // 3. Successful Login
      // Enforce Admin Role Rule for specific email
      if (existingUser.email === ADMIN_EMAIL && existingUser.role !== 'admin') {
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
        return "This email is already registered.";
      }
      
      // 2. Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // 3. Create Unverified User
      const role = data.email === ADMIN_EMAIL ? 'admin' : 'client';
      const newUser: User = {
        id: `u${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: `https://picsum.photos/seed/${data.name}/100/100`,
        role: role,
        password: data.password,
        isVerified: false,
        verificationCode: otp
      };
      
      setRegisteredUsers(prev => [...prev, newUser]);
      setPendingVerificationEmail(newUser.email);
      
      // Show Verification UI
      alert(`Verification Code: ${otp}`);
      setShowVerifyModal(true);
    }
  };

  const handleVerify = (code: string) => {
      const userToVerify = registeredUsers.find(u => u.email === pendingVerificationEmail);
      if (!userToVerify) return;

      if (userToVerify.verificationCode === code) {
          // Update user status
          const updatedUser: User = { ...userToVerify, isVerified: true };
          
          // Update DB
          setRegisteredUsers(prev => prev.map(u => u.email === pendingVerificationEmail ? updatedUser : u));
          
          // Login User
          setUser(updatedUser);
          setShowVerifyModal(false);
          alert("Account Verified Successfully!");
          
          if (updatedUser.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
      } else {
          alert("Invalid Verification Code. Please try again.");
      }
  };

  const handleResendCode = () => {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setRegisteredUsers(prev => prev.map(u => u.email === pendingVerificationEmail ? { ...u, verificationCode: newCode } : u));
      // In a real app, send email here.
      console.log(`Resent Code: ${newCode}`); 
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
      if (!user) return;
      
      // If email is changing, we must re-verify
      if (updatedData.email && updatedData.email !== user.email) {
          const otp = Math.floor(1000 + Math.random() * 9000).toString();
          const updatedUser = { ...user, ...updatedData, isVerified: false, verificationCode: otp };
          
          // Update DB
          setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
          
          // Logout and show verify
          setUser(null);
          setPendingVerificationEmail(updatedUser.email);
          alert(`Email changed. Verification Code: ${otp}`);
          setShowVerifyModal(true);
          return;
      }

      const updatedUser = { ...user, ...updatedData };
      setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      setUser(updatedUser);
  };

  const handleDeleteAccount = () => {
      if (!user) return;
      
      // Requirement: Admin Must NOT See Delete Account Button (Backend block)
      if (user.email === ADMIN_EMAIL || user.role === 'admin') {
          alert("Admin account cannot be deleted.");
          return;
      }

      try {
          // Requirement: Database Consistency (Cascade Delete)
          setRegisteredUsers(prev => prev.filter(u => u.id !== user.id));
          setMessages(prev => prev.filter(m => m.senderId !== user.id)); // Remove messages sent by user
          setSiteReviews(prev => prev.filter(r => r.userId !== user.id)); // Remove reviews by user
          
          // Requirement: Clear all saved session data and Log the user out
          setUser(null);
          localStorage.removeItem('currentUser');
          
          // Requirement: Redirect user to the Login Page
          navigate('/login');
          
          // Feedback
          alert("Your account has been deleted successfully.");
      } catch (error) {
          // Requirement: Error Handling
          console.error("Deletion Error:", error);
          alert("Error deleting account. Please try again.");
      }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  // SUPABASE: Checkout Logic (Updated with CheckoutData)
  const handleOrder = async (serviceId: string, checkoutData: CheckoutData) => {
    const service = services.find(s => s.id === serviceId);
    if (service && user) {
      
      // Insert into Supabase 'orders' table
      // Mapping our form data to the specific columns requested
      const { data, error } = await supabase
        .from('orders')
        .insert([{
            first_name: checkoutData.firstName,
            last_name: checkoutData.lastName,
            email: checkoutData.email,
            street_address: checkoutData.address,
            city: checkoutData.city,
            zip_code: checkoutData.zip,
            product_name: service.title,
            total_amount: Number(service.price), // Ensure number type
            status: 'active'
        }])
        .select();

      if (error) {
        console.error('Supabase Order Error:', JSON.stringify(error, null, 2));
        alert(`Order Failed: ${error.message || 'Unknown error. Check console.'}`);
        return;
      }
      
      // Update Local State for immediate UI feedback (simulating the returned order structure for internal app use)
      const newOrder: Order = {
        id: data && data[0] ? data[0].id.toString() : `o${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        serviceImage: service.image,
        price: service.price,
        status: 'active',
        date: new Date().toLocaleDateString(),
        clientName: `${checkoutData.firstName} ${checkoutData.lastName}`
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
    // Optionally update Supabase status here as well
    // supabase.from('orders').update({ status }).eq('id', id)...
  };
  
  // Message Handling
  const handleSendMessage = (text: string, attachment?: string) => {
    if (!user) return;
    
    // Find Admin to receive message
    const adminUser = registeredUsers.find(u => u.role === 'admin' || u.email === ADMIN_EMAIL);
    const receiverId = adminUser ? adminUser.id : 'admin';

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

  const handleMarkAsRead = (senderId: string) => {
      if (!user) return;
      // Mark all messages from this sender to current user as read
      setMessages(prev => prev.map(m => 
        (m.senderId === senderId && m.receiverId === user.id && !m.isRead) 
          ? { ...m, isRead: true } 
          : m
      ));
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

  // Notification counts
  const notificationCount = orders.filter(o => o.status === 'active').length + unreadMessagesCount;

  return (
    <>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        notificationCount={notificationCount} 
        unreadMessageCount={unreadMessagesCount} 
        appName={siteName}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail user={user} onOrder={handleOrder} />} />
          <Route path="/reviews" element={<Reviews user={user} reviews={siteReviews} onAddReview={handleAddReview} />} />
          
          {/* USER SETTINGS */}
          <Route 
             path="/settings" 
             element={
                 user ? (
                    <UserSettings 
                        user={user} 
                        onUpdateProfile={handleUpdateProfile} 
                        onDeleteAccount={handleDeleteAccount} 
                    />
                 ) : (
                     <Navigate to="/login" />
                 )
             } 
          />
          
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
                  onMarkAsRead={handleMarkAsRead}
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
      {showVerifyModal && (
          <VerificationModal 
             email={pendingVerificationEmail} 
             onVerify={handleVerify} 
             onResend={handleResendCode} 
             onClose={() => setShowVerifyModal(false)}
          />
      )}
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
