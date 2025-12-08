import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp, Code, PenTool, Layout as LayoutIcon } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { MOCK_SERVICES, TESTIMONIALS } from '../constants';

export const Home: React.FC = () => {
  const featuredServices = MOCK_SERVICES.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-theme-card overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl opacity-60 animate-blob mix-blend-multiply dark:mix-blend-lighten filter"></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary-100 dark:bg-secondary-900/30 rounded-full blur-3xl opacity-60 animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-lighten filter"></div>
            <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-100 dark:bg-pink-900/30 rounded-full blur-3xl opacity-60 animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-lighten filter"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-card/50 backdrop-blur-sm border border-theme-border shadow-sm animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-premium-aqua"></span>
                <span className="text-theme-muted text-sm font-semibold">Available for new projects</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-theme-text tracking-tight leading-[1.1]">
                Hire expert services <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-royal via-premium-indigo to-premium-royal bg-[length:200%_auto] animate-gradient">
                  to elevate your brand
                </span>
              </h1>
              
              <p className="text-xl text-theme-muted leading-relaxed max-w-lg">
                Your vision, my expertise. Get high-quality development, design, and digital services tailored to your needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-premium-royal to-premium-indigo text-white rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-2 group">
                  Order Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="px-8 py-4 bg-theme-card/50 backdrop-blur-sm text-theme-text border border-theme-border rounded-full font-bold text-lg hover:bg-theme-card hover:shadow-[0_0_15px_rgba(6,214,160,0.3)] transition-all text-center">
                  View Services
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm text-theme-muted font-medium">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`w-10 h-10 rounded-full border-2 border-theme-card bg-gray-200 overflow-hidden`}>
                       <img src={`https://picsum.photos/seed/u${i}/100/100`} alt="Client" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-theme-card bg-gray-900 text-white flex items-center justify-center text-xs">+500</div>
                </div>
                <div>
                  <p className="text-theme-text font-bold">500+ Happy Clients</p>
                  <div className="flex text-yellow-500 text-xs">★★★★★</div>
                </div>
              </div>
            </div>

            {/* 3D/Interactive Elements Placeholder */}
            <div className="lg:w-1/2 relative perspective-1000">
               <div className="relative z-10 transform transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12 preserve-3d">
                  <div className="glass p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-white/10 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur-xl">
                      {/* Abstract UI Representation */}
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-premium-royal to-premium-indigo p-0.5">
                                <img src="https://picsum.photos/seed/aqib/200/200" alt="Aqib" className="w-full h-full rounded-full border-2 border-white dark:border-slate-700" />
                             </div>
                             <div>
                                <h3 className="font-bold text-theme-text">Aqib Ali</h3>
                                <p className="text-xs text-theme-muted">Full Stack Developer</p>
                             </div>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                             <span className="w-2 h-2 bg-premium-aqua rounded-full animate-pulse"></span> Online
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div className="bg-white/60 dark:bg-slate-700/50 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-premium-royal"><Code className="w-6 h-6" /></div>
                              <div>
                                  <h4 className="font-bold text-theme-text">Web Development</h4>
                                  <p className="text-xs text-theme-muted">React, Node.js, TypeScript</p>
                              </div>
                              <ArrowRight className="w-4 h-4 ml-auto text-theme-muted" />
                          </div>
                          <div className="bg-white/60 dark:bg-slate-700/50 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600 dark:text-purple-400"><LayoutIcon className="w-6 h-6" /></div>
                              <div>
                                  <h4 className="font-bold text-theme-text">UI/UX Design</h4>
                                  <p className="text-xs text-theme-muted">Figma, Modern Interfaces</p>
                              </div>
                              <ArrowRight className="w-4 h-4 ml-auto text-theme-muted" />
                          </div>
                          <div className="bg-white/60 dark:bg-slate-700/50 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg text-pink-600 dark:text-pink-400"><PenTool className="w-6 h-6" /></div>
                              <div>
                                  <h4 className="font-bold text-theme-text">Content Strategy</h4>
                                  <p className="text-xs text-theme-muted">SEO, Copywriting</p>
                              </div>
                              <ArrowRight className="w-4 h-4 ml-auto text-theme-muted" />
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-theme-border flex justify-between items-center">
                          <div className="text-center">
                              <p className="text-2xl font-bold text-theme-text">98%</p>
                              <p className="text-xs text-theme-muted uppercase tracking-wide">Success Rate</p>
                          </div>
                          <div className="h-8 w-px bg-theme-border"></div>
                          <div className="text-center">
                              <p className="text-2xl font-bold text-theme-text">24/7</p>
                              <p className="text-xs text-theme-muted uppercase tracking-wide">Support</p>
                          </div>
                          <div className="h-8 w-px bg-theme-border"></div>
                          <div className="text-center">
                              <p className="text-2xl font-bold text-theme-text">100+</p>
                              <p className="text-xs text-theme-muted uppercase tracking-wide">Projects</p>
                          </div>
                      </div>
                  </div>

                  {/* Floating elements behind */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-2xl rotate-12 -z-10 opacity-20 animate-bounce"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-premium-royal rounded-full -z-10 opacity-20 animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-theme-text mb-4">My Expert Services</h2>
            <p className="text-theme-muted max-w-2xl">I offer a wide range of digital services to help your business grow. Choose a category below or browse all services.</p>
          </div>
          <Link to="/services" className="hidden md:flex items-center px-6 py-3 bg-theme-card text-theme-text rounded-full font-semibold hover:bg-theme-main transition-colors border border-theme-border hover:shadow-[0_0_10px_rgba(6,214,160,0.3)]">
            View All Services <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <Link to="/services" className="inline-flex items-center text-premium-royal font-semibold">
            View All Services <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Why Hire Me */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Hire Me?</h2>
              <p className="text-gray-400">I deliver more than just a service; I deliver a partnership. Here is what you get when you work with me.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-colors">
                 <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-7 h-7 text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Direct Communication</h3>
                 <p className="text-gray-400 leading-relaxed">No middlemen. You speak directly with me to ensure your requirements are perfectly understood.</p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-colors">
                 <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-purple-400" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Fast Turnaround</h3>
                 <p className="text-gray-400 leading-relaxed">I respect your time. Get your projects delivered on time, every time, without compromising quality.</p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-colors">
                 <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-green-400" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Payment Security</h3>
                 <p className="text-gray-400 leading-relaxed">Secure payments via Stripe/PayPal. Funds are only released when you are 100% satisfied.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-theme-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-theme-text mb-16">Client Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map(t => (
                    <div key={t.id} className="bg-theme-card p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-theme-border hover:-translate-y-2 transition-transform duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-100" />
                            <div>
                                <h4 className="font-bold text-theme-text text-lg">{t.name}</h4>
                                <p className="text-sm text-premium-royal font-medium">{t.role}</p>
                            </div>
                        </div>
                        <p className="text-theme-muted italic leading-relaxed">"{t.text}"</p>
                        <div className="mt-6 flex text-yellow-400">
                          {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Newsletter Popup / Section */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-premium-royal to-premium-indigo rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
           <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your project?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">Join the newsletter to receive exclusive offers and updates on my services.</p>
              <form className="max-w-md mx-auto flex gap-2">
                 <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-premium-aqua/50" />
                 <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all">Subscribe</button>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
};