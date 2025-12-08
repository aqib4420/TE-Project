import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sun, Moon, LayoutDashboard, Settings } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-theme-main transition-colors duration-300">
      {/* Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'glass shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                TR
              </div>
              <span className={`text-2xl font-bold tracking-tight text-theme-text`}>{appName}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-theme-muted hover:text-premium-royal font-medium transition-colors">Home</Link>
              <Link to="/services" className="text-theme-muted hover:text-premium-royal font-medium transition-colors">Services</Link>
              <Link to="/reviews" className="text-theme-muted hover:text-premium-royal font-medium transition-colors">Reviews</Link>
              
              {/* Only show 'Dashboard' (Client) if logged in as client */}
              {user && !isAdmin && (
                <Link to="/dashboard" className="text-theme-muted hover:text-premium-royal font-medium transition-colors relative">
                  Dashboard
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-3.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center shadow-md animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Only show 'Admin Panel' if logged in as Admin */}
              {isAdmin && (
                <Link to="/admin-dashboard" className="flex items-center gap-2 text-premium-royal font-bold transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full relative">
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
                className="p-2 rounded-full text-theme-muted hover:bg-theme-main hover:text-premium-royal transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 relative group">
                      <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-theme-border cursor-pointer" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-theme-text leading-none">{user.name}</span>
                        {isAdmin && <span className="text-[10px] text-premium-royal font-bold uppercase">Admin</span>}
                      </div>

                      {/* Dropdown Menu */}
                      <div className="absolute top-full right-0 mt-2 w-48 bg-theme-card border border-theme-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                          <Link to="/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-theme-text hover:bg-theme-main rounded-t-xl transition-colors">
                              <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors text-left">
                              <LogOut className="w-4 h-4" /> Logout
                          </button>
                      </div>
                   </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-theme-text font-medium hover:text-premium-royal transition-colors">Log In</Link>
                  <Link to="/register" className="bg-gradient-to-r from-premium-royal to-premium-indigo text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transform hover:-translate-y-0.5">
                    Order Now
                  </Link>
                </>
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
          <div className="md:hidden absolute top-full left-0 w-full bg-theme-card/95 backdrop-blur-md border-t border-theme-border shadow-xl p-4 flex flex-col space-y-4 animate-fadeIn">
            <Link to="/" className="text-theme-text font-medium p-2 hover:bg-theme-main rounded-lg">Home</Link>
            <Link to="/services" className="text-theme-text font-medium p-2 hover:bg-theme-main rounded-lg">Services</Link>
            <Link to="/reviews" className="text-theme-text font-medium p-2 hover:bg-theme-main rounded-lg">Reviews</Link>
            
            {user && !isAdmin && (
              <Link to="/dashboard" className="text-theme-text font-medium p-2 hover:bg-theme-main rounded-lg flex items-center justify-between">
                Dashboard
                {notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notificationCount} New
                  </span>
                )}
              </Link>
            )}

            {user && (
                 <Link to="/settings" className="text-theme-text font-medium p-2 hover:bg-theme-main rounded-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                 </Link>
            )}

            {isAdmin && (
               <Link to="/admin-dashboard" className="text-premium-royal font-bold p-2 hover:bg-primary-50 rounded-lg flex items-center justify-between">
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
               <button onClick={onLogout} className="text-red-600 font-medium p-2 hover:bg-red-50 rounded-lg text-left flex items-center gap-2">
                 <LogOut className="w-4 h-4" /> Sign Out
               </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-center text-theme-text font-medium border border-theme-border py-2 rounded-full hover:bg-theme-main transition-colors">Log In</Link>
                <Link to="/register" className="text-center bg-gradient-to-r from-premium-royal to-premium-indigo text-white font-medium py-2 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all">Order Now</Link>
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
      <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
        {/* Background blobs for footer */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-premium-royal/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-premium-indigo/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  TR
                </div>
                <span className="text-2xl font-bold">{appName}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your one-stop destination for expert digital services. High-quality work, delivered on time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-premium-royal transition-colors"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-premium-royal transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-premium-royal transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-premium-royal transition-colors"><Linkedin className="w-4 h-4" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-premium-royal" />
                  <a href="mailto:aqibnaich442002@gmail.com" className="hover:text-white transition-colors">aqibnaich442002@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-premium-royal" />
                  <a href="tel:+923093449125" className="hover:text-white transition-colors">+92 309 344 9125</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-premium-royal mt-0.5" />
                  <span>Available Globally<br/>Based in Pakistan</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/services?cat=dev" className="hover:text-white transition-colors">Web Development</Link></li>
                <li><Link to="/services?cat=design" className="hover:text-white transition-colors">UI/UX Design</Link></li>
                <li><Link to="/services?cat=marketing" className="hover:text-white transition-colors">Digital Marketing</Link></li>
                <li><Link to="/services?cat=video" className="hover:text-white transition-colors">Video Editing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to get updates on new services and offers.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="bg-gray-800 border-none text-white text-sm rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-premium-royal" />
                <button className="bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] px-4 py-2 rounded-lg text-sm font-medium transition-all text-white">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 {appName}. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};