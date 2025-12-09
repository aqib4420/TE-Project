
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Mail, Phone, MapPin, Facebook, Instagram, Sun, Moon, LayoutDashboard, Settings, MessageCircle, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onLogout: () => void;
  notificationCount?: number;
  unreadMessageCount?: number;
  appName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, notificationCount = 0, unreadMessageCount = 0, appName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [logoError, setLogoError] = useState(false); // Handle broken image
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const adjustColor = (color: string, amount: number) => {
    if (!color || !color.startsWith('#')) return color;
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  // Theme & Color Loading Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Load custom colors from persistence
    const savedPrimary = localStorage.getItem('primaryColor');
    const savedSecondary = localStorage.getItem('secondaryColor');
    const savedBorder = localStorage.getItem('borderColor');
    const savedCardBg = localStorage.getItem('cardBgColor');
    
    if (savedPrimary) {
        document.documentElement.style.setProperty('--color-primary-500', savedPrimary);
        document.documentElement.style.setProperty('--color-primary-600', adjustColor(savedPrimary, -20));
    }
    if (savedSecondary) {
        document.documentElement.style.setProperty('--color-secondary-500', savedSecondary);
        document.documentElement.style.setProperty('--color-secondary-600', adjustColor(savedSecondary, -20));
    }
    if (savedBorder) {
        document.documentElement.style.setProperty('--border-color', savedBorder);
    }
    if (savedCardBg) {
        document.documentElement.style.setProperty('--bg-card', savedCardBg);
    }

  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-theme-main transition-colors duration-300 font-sans">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all transform group-hover:rotate-3">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
              <span className={`text-2xl font-extrabold tracking-tight text-theme-text group-hover:text-premium-royal transition-colors`}>{appName}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-theme-muted hover:text-premium-royal font-medium transition-colors hover:bg-theme-main/50 px-3 py-1.5 rounded-lg">Home</Link>
              <Link to="/services" className="text-theme-muted hover:text-premium-royal font-medium transition-colors hover:bg-theme-main/50 px-3 py-1.5 rounded-lg">Services</Link>
              <Link to="/reviews" className="text-theme-muted hover:text-premium-royal font-medium transition-colors hover:bg-theme-main/50 px-3 py-1.5 rounded-lg">Reviews</Link>
              
              {/* Only show 'Dashboard' (Client) if logged in as client */}
              {user && !isAdmin && (
                <Link to="/dashboard" className="text-theme-muted hover:text-premium-royal font-medium transition-colors relative hover:bg-theme-main/50 px-3 py-1.5 rounded-lg">
                  Dashboard
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center shadow-md animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Only show 'Admin Panel' if logged in as Admin */}
              {isAdmin && (
                <Link to="/admin-dashboard" className="flex items-center gap-2 text-premium-royal font-bold transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 relative hover:bg-blue-100">
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center shadow-md animate-pulse">
                      {unreadMessageCount}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* Auth Buttons / Profile / Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-full text-theme-muted hover:bg-theme-card hover:text-premium-royal transition-all shadow-sm border border-transparent hover:border-theme-border"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-3 relative group px-2 py-1 rounded-xl hover:bg-theme-card transition-colors cursor-pointer">
                      <div className="relative">
                        <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border-2 border-premium-royal/20" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-theme-text leading-tight">{user.name}</span>
                        <span className="text-[10px] text-theme-muted font-medium uppercase tracking-wide">{isAdmin ? 'Admin' : 'Client'}</span>
                      </div>

                      {/* Dropdown Menu */}
                      <div className="absolute top-full right-0 mt-3 w-56 bg-theme-card border border-theme-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                          <div className="p-3 border-b border-theme-border bg-theme-main/50">
                             <p className="text-xs text-theme-muted">Signed in as</p>
                             <p className="text-sm font-bold text-theme-text truncate">{user.email}</p>
                          </div>
                          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-theme-text hover:bg-theme-main transition-colors">
                              <Settings className="w-4 h-4 text-theme-muted" /> Account Settings
                          </Link>
                          {isAdmin && (
                             <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-theme-text hover:bg-theme-main transition-colors">
                                <LayoutDashboard className="w-4 h-4 text-theme-muted" /> Dashboard
                             </Link>
                          )}
                          <div className="h-px bg-theme-border my-1"></div>
                          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium">
                              <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-theme-text font-semibold hover:text-premium-royal transition-colors px-3">Log In</Link>
                  <Link to="/register" className="bg-gradient-to-r from-premium-royal to-premium-indigo text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-premium-royal/30 hover:shadow-premium-royal/50 transform hover:-translate-y-0.5 active:scale-95">
                    Order Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-theme-muted hover:bg-theme-main"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button 
                className="text-theme-text p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-theme-card/95 backdrop-blur-md border-t border-theme-border shadow-xl p-4 flex flex-col space-y-4 animate-fadeIn h-screen">
            <Link to="/" className="text-theme-text font-bold text-lg p-2 hover:bg-theme-main rounded-lg">Home</Link>
            <Link to="/services" className="text-theme-text font-bold text-lg p-2 hover:bg-theme-main rounded-lg">Services</Link>
            <Link to="/reviews" className="text-theme-text font-bold text-lg p-2 hover:bg-theme-main rounded-lg">Reviews</Link>
            
            {user && !isAdmin && (
              <Link to="/dashboard" className="text-theme-text font-bold text-lg p-2 hover:bg-theme-main rounded-lg flex items-center justify-between">
                Dashboard
                {notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notificationCount} New
                  </span>
                )}
              </Link>
            )}

            {user && (
                 <Link to="/settings" className="text-theme-text font-bold text-lg p-2 hover:bg-theme-main rounded-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Settings
                 </Link>
            )}

            {isAdmin && (
               <Link to="/admin-dashboard" className="text-premium-royal font-bold text-lg p-2 hover:bg-primary-50 rounded-lg flex items-center justify-between">
                 Admin Panel
                 {unreadMessageCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadMessageCount} New
                    </span>
                 )}
               </Link>
            )}

            <hr className="border-theme-border" />
            {user ? (
               <button onClick={onLogout} className="text-red-600 font-bold text-lg p-2 hover:bg-red-50 rounded-lg text-left flex items-center gap-2">
                 <LogOut className="w-5 h-5" /> Sign Out
               </button>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <Link to="/login" className="text-center text-theme-text font-bold text-lg border-2 border-theme-border py-3 rounded-xl hover:bg-theme-main transition-colors">Log In</Link>
                <Link to="/register" className="text-center bg-gradient-to-r from-premium-royal to-premium-indigo text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">Order Now</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 relative overflow-hidden">
        {/* Background blobs for footer */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-premium-royal/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-premium-indigo/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                {!logoError ? (
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" onError={() => setLogoError(true)} />
                ) : (
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold">
                        TR
                    </div>
                )}
                <span className="text-2xl font-bold tracking-tight">{appName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your one-stop destination for expert digital services. We connect visionaries with builders to create world-class products.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/share/1FXQ7o2avS/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:-translate-y-1 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/techr_each?igsh=MmpveHZ2aHhwcGo3" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:-translate-y-1 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://whatsapp.com/channel/0029Vb75DdLCXC3N2LEdye1O" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:-translate-y-1 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-premium-royal transition-colors">
                     <Mail className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  </div>
                  <a href="mailto:aqibnaich442002@gmail.com" className="hover:text-white transition-colors">aqibnaich442002@gmail.com</a>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-premium-royal transition-colors">
                     <Phone className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  </div>
                  <a href="tel:+923093449125" className="hover:text-white transition-colors">+92 309 344 9125</a>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-premium-royal transition-colors mt-1">
                     <MapPin className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  </div>
                  <span>Available Globally<br/>Based in Pakistan</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Popular Services</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/services?cat=dev" className="hover:text-premium-royal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full hover:bg-premium-royal"></span> Web Development</Link></li>
                <li><Link to="/services?cat=design" className="hover:text-premium-royal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full hover:bg-premium-royal"></span> UI/UX Design</Link></li>
                <li><Link to="/services?cat=marketing" className="hover:text-premium-royal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full hover:bg-premium-royal"></span> Digital Marketing</Link></li>
                <li><Link to="/services?cat=video" className="hover:text-premium-royal transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full hover:bg-premium-royal"></span> Video Editing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Join Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Get the latest updates and exclusive offers directly in your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email address" className="bg-gray-800/50 border border-gray-700 text-white text-sm rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-premium-royal focus:border-transparent outline-none transition-all placeholder-gray-500" />
                <button className="bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] px-5 py-3 rounded-lg text-sm font-bold transition-all text-white transform hover:scale-105 active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 {appName}. All rights reserved.</p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
