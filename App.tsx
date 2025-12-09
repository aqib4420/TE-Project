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

// Firebase Imports
import { auth, db } from './services/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

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
const AuthPage = ({ onAuth }: { onAuth: (data: any, isLogin: boolean) => Promise<string | void> }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const error = await onAuth(formData, isLogin);
      if (error) {
        setLoginError(error);
      }
    } catch (err: any) {
        setLoginError(err.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginError('');
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
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [orders, setOrders] = useState<Order[]>([]);
  // We keep registeredUsers for the Admin View to show list of users
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);
  const [siteName, setSiteName] = useState(() => localStorage.getItem('appName') || APP_NAME);

  // Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  const navigate = useNavigate();

  // 1. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // User is signed in, fetch profile from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                // Enforce Admin Role Rule for specific email even if Firestore is outdated
                if (firebaseUser.email === ADMIN_EMAIL && userData.role !== 'admin') {
                   userData.role = 'admin';
                }
                
                // Update verification status from Firebase Auth object
                const isEmailVerified = firebaseUser.emailVerified;
                
                // Merge Firebase Auth state with Firestore data
                const mergedUser = { 
                    ...userData, 
                    isVerified: isEmailVerified,
                    // If we use OTP modal, we rely on our custom field, 
                    // if we use Firebase Link, we rely on emailVerified
                };
                
                setUser(mergedUser);
            }
        } else {
            // User is signed out
            setUser(null);
        }
    });

    return () => unsubscribe();
  }, []);

  // 2. Firestore Listeners for Realtime Data
  useEffect(() => {
      // Listen for Orders
      const q = query(collection(db, "orders"));
      const unsubscribeOrders = onSnapshot(q, (snapshot) => {
          const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
          // Client only sees their own orders, Admin sees all
          setOrders(fetchedOrders);
      });

      // Listen for Messages
      const qMsgs = query(collection(db, "messages"));
      const unsubscribeMessages = onSnapshot(qMsgs, (snapshot) => {
          const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DirectMessage));
          setMessages(fetchedMessages);
      });

      // Listen for Reviews
      const qReviews = query(collection(db, "reviews"));
      const unsubscribeReviews = onSnapshot(qReviews, (snapshot) => {
          const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SiteReview));
          setSiteReviews(fetchedReviews);
      });
      
      // Listen for Users (For Admin Panel)
      const qUsers = query(collection(db, "users"));
      const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
          const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          setRegisteredUsers(fetchedUsers);
      });

      return () => {
          unsubscribeOrders();
          unsubscribeMessages();
          unsubscribeReviews();
          unsubscribeUsers();
      };
  }, []);

  // 3. Save Site Name
  useEffect(() => { localStorage.setItem('appName', siteName); }, [siteName]);

  // Calculate unread messages dynamically
  const unreadMessagesCount = user 
    ? messages.filter(m => !m.isRead && m.receiverId === user.id).length
    : 0;

  // Authentication Handler (Firebase)
  const handleAuth = async (data: any, isLogin: boolean): Promise<string | void> => {
    try {
        if (isLogin) {
            // FIREBASE SIGN IN
            await signInWithEmailAndPassword(auth, data.email, data.password);
            // onAuthStateChanged will handle the redirect and state update
            // We can return void if successful
            return;
        } else {
            // FIREBASE SIGN UP
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const firebaseUser = userCredential.user;
            
            // Generate OTP for local verification fallback
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const role = data.email === ADMIN_EMAIL ? 'admin' : 'client';
            
            const newUser: User = {
                id: firebaseUser.uid,
                name: data.name,
                email: data.email,
                phone: data.phone,
                avatar: `https://picsum.photos/seed/${data.name}/100/100`,
                role: role,
                password: data.password, // Storing password locally only if requested by prompt requirements, otherwise unsafe!
                isVerified: false,
                verificationCode: otp
            };

            // Save extended profile to Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
            
            setPendingVerificationEmail(newUser.email);
            setShowVerifyModal(true);
            
            // Optionally send Firebase Email Verification
            // await sendEmailVerification(firebaseUser);
            alert(`Verification Code: ${otp}`);
        }
    } catch (error: any) {
        console.error("Firebase Auth Error:", error);
        if (error.code === 'auth/wrong-password') return "Incorrect password. Please try again.";
        if (error.code === 'auth/user-not-found') return "Account does not exist. Please register first.";
        if (error.code === 'auth/email-already-in-use') return "This email is already registered.";
        if (error.code === 'auth/weak-password') return "Password must be at least 6 characters long.";
        if (error.code === 'auth/invalid-credential') return "Invalid credentials.";
        return error.message;
    }
  };

  const handleVerify = async (code: string) => {
      // Find the user document corresponding to pending email
      // Since we need the UID to update firestore, we rely on the currently logged in firebase user 
      // OR query firestore by email
      
      const q = query(collection(db, "users"), where("email", "==", pendingVerificationEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data() as User;

          if (userData.verificationCode === code) {
              // Update Firestore
              await updateDoc(doc(db, "users", userDoc.id), { isVerified: true });
              
              // Refresh Local User
              const updatedUser = { ...userData, isVerified: true };
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
      }
  };

  const handleResendCode = async () => {
      // Logic to update code in firestore
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      const q = query(collection(db, "users"), where("email", "==", pendingVerificationEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "users", userDoc.id), { verificationCode: newCode });
          console.log(`Resent Code: ${newCode}`);
          alert(`New code sent to ${pendingVerificationEmail}: ${newCode}`);
      }
  };

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
      if (!user) return;
      
      // Update Firestore
      await updateDoc(doc(db, "users", user.id), updatedData);
      
      // Update Local State
      setUser({ ...user, ...updatedData });
  };

  const handleDeleteAccount = async () => {
      if (!user) return;
      
      if (user.email === ADMIN_EMAIL || user.role === 'admin') {
          alert("Admin account cannot be deleted.");
          return;
      }

      try {
          // Cascade Delete Logic:
          // 1. Delete User Doc
          await deleteDoc(doc(db, "users", user.id));
          
          // 2. Delete Messages (Query and delete)
          const msgsQ = query(collection(db, "messages"), where("senderId", "==", user.id));
          const msgsSnapshot = await getDocs(msgsQ);
          msgsSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));

          // 3. Delete Reviews
          const reviewsQ = query(collection(db, "reviews"), where("userId", "==", user.id));
          const reviewsSnapshot = await getDocs(reviewsQ);
          reviewsSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));

          // 4. Firebase Auth Delete
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
              await firebaseUser.delete();
          }

          setUser(null);
          navigate('/login');
          alert("Your account has been deleted successfully.");
      } catch (error) {
          console.error("Deletion Error:", error);
          alert("Error deleting account. Please try again.");
      }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const handleOrder = async (serviceId: string, checkoutData: CheckoutData) => {
    const service = services.find(s => s.id === serviceId);
    if (service && user) {
        // Save to Firestore
        await addDoc(collection(db, "orders"), {
            serviceId: service.id,
            serviceTitle: service.title,
            serviceImage: service.image,
            price: service.price,
            status: 'active',
            date: new Date().toLocaleDateString(),
            clientName: `${checkoutData.firstName} ${checkoutData.lastName}`,
            clientId: user.id,
            // Extra checkout data
            email: checkoutData.email,
            address: checkoutData.address,
            city: checkoutData.city,
            zip: checkoutData.zip
        });
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

  const handleUpdateOrder = async (id: string, status: Order['status'], deliverables?: string) => {
    // Update Firestore
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status, deliverables });
  };
  
  // Message Handling
  const handleSendMessage = async (text: string, attachment?: string) => {
    if (!user) return;
    
    // Find Admin ID (fallback to 'admin' string or fetch actual admin UID)
    const adminUser = registeredUsers.find(u => u.role === 'admin' || u.email === ADMIN_EMAIL);
    const receiverId = adminUser ? adminUser.id : 'admin_placeholder';

    await addDoc(collection(db, "messages"), {
        senderId: user.id,
        senderName: user.name,
        receiverId: receiverId, 
        text,
        attachment: attachment || null,
        timestamp: new Date().toISOString(), // Use ISO string for Firestore
        isRead: false
    });
  };

  // Admin sending message
  const handleAdminSendMessage = async (receiverId: string, text: string, attachment?: string) => {
      if (!user) return;
      await addDoc(collection(db, "messages"), {
          senderId: user.id,
          senderName: user.name,
          receiverId,
          text,
          attachment: attachment || null,
          timestamp: new Date().toISOString(),
          isRead: false
      });
  };

  const handleMarkAsRead = async (senderId: string) => {
      if (!user) return;
      // Find messages to update
      // Firestore batch update would be better, but doing client-side filter for simplicity
      const unreadMsgs = messages.filter(m => m.senderId === senderId && m.receiverId === user.id && !m.isRead);
      
      unreadMsgs.forEach(async (msg) => {
          await updateDoc(doc(db, "messages", msg.id), { isRead: true });
      });
  };

  // Review Handling
  const handleAddReview = async (rating: number, comment: string) => {
      if(!user) return;
      await addDoc(collection(db, "reviews"), {
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          rating,
          comment,
          date: new Date().toLocaleDateString()
      });
  };

  const handleDeleteReview = async (id: string) => {
      await deleteDoc(doc(db, "reviews", id));
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
            element={user ? <Dashboard user={user} orders={orders.filter(o => user.role === 'client' ? o.clientId === user.id : true)} /> : <Navigate to="/login" />} 
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