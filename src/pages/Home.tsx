
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Code, PenTool, Layout as LayoutIcon, Star, MousePointer, Layers, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { MOCK_SERVICES, TESTIMONIALS } from '../constants';

export const Home: React.FC = () => {
  const featuredServices = MOCK_SERVICES.slice(0, 3);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-theme-main overflow-hidden min-h-[90vh] flex items-center justify-center pt-20 lg:pt-0">
        {/* Animated Background Mesh Gradient */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen filter"></div>
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen filter"></div>
            <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen filter"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            {/* Text Content */}
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700 shadow-sm animate-fade-in-up">
                <span className="flex h-2.5 w-2.5 rounded-full bg-premium-aqua shadow-[0_0_10px_#06D6A0]"></span>
                <span className="text-gray-700 dark:text-gray-200 text-sm font-bold tracking-wide">Available for new projects</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-theme-text tracking-tight leading-[1.1]">
                Hire expert services <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-royal via-purple-500 to-premium-aqua bg-[length:200%_auto] animate-gradient pb-2">
                  to elevate your brand
                </span>
              </h1>
              
              <p className="text-xl text-theme-muted leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                Transform your vision into reality. I provide high-quality development, design, and digital strategies tailored to scale your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-premium-royal to-premium-indigo text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-2 group ring-4 ring-transparent hover:ring-blue-500/20">
                  Order Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-theme-text border border-gray-200 dark:border-slate-700 rounded-full font-bold text-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all text-center">
                  View Services
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-theme-muted font-medium">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200 overflow-hidden shadow-md relative z-${10-i}`}>
                       <img src={`https://picsum.photos/seed/u${i}/100/100`} alt="Client" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-md z-0">+500</div>
                </div>
                <div>
                  <p className="text-theme-text font-bold text-base">500+ Happy Clients</p>
                  <div className="flex text-yellow-500 text-xs">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3D/Interactive Elements */}
            <div className="lg:w-1/2 relative perspective-1000 w-full max-w-lg lg:max-w-none">
               <div className="relative z-10 transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6 preserve-3d">
                  {/* Glass Card */}
                  <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-white/90 to-white/40 dark:from-slate-800/90 dark:to-slate-900/40 backdrop-blur-2xl">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-full bg-gradient-to-br from-premium-royal to-premium-indigo p-[3px] shadow-lg">
                                <img src="https://picsum.photos/seed/aqib/200/200" alt="Aqib" className="w-full h-full rounded-full border-2 border-white dark:border-slate-800 object-cover" />
                             </div>
                             <div>
                                <h3 className="font-bold text-lg text-theme-text">Aqib Ali</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold uppercase tracking-wider">Expert</span>
                                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold uppercase tracking-wider">Verified</span>
                                </div>
                             </div>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border border-green-200 dark:border-green-900">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span> Online Now
                          </div>
                      </div>

                      {/* Services List Simulated */}
                      <div className="space-y-4">
                          {[
                              { icon: <Code className="w-5 h-5" />, title: "Web Development", sub: "React, Node.js, Next.js", color: "bg-blue-500" },
                              { icon: <LayoutIcon className="w-5 h-5" />, title: "UI/UX Design", sub: "Figma, Modern Interfaces", color: "bg-purple-500" },
                              { icon: <Layers className="w-5 h-5" />, title: "Full Stack App", sub: "Database, API, Deployment", color: "bg-pink-500" }
                          ].map((item, idx) => (
                              <div key={idx} className="group bg-white/70 dark:bg-slate-700/60 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border border-white/50 dark:border-slate-600/50">
                                  <div className={`${item.color} p-3 rounded-xl text-white shadow-lg shadow-${item.color.replace('bg-', '')}/30`}>
                                      {item.icon}
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-theme-text group-hover:text-premium-royal transition-colors">{item.title}</h4>
                                      <p className="text-xs text-theme-muted font-medium">{item.sub}</p>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center group-hover:bg-premium-royal group-hover:text-white transition-colors">
                                      <ArrowRight className="w-4 h-4" />
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Stats Footer */}
                      <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/60 flex justify-between items-center px-2">
                          <div className="text-center">
                              <p className="text-2xl font-black text-theme-text">98%</p>
                              <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Success</p>
                          </div>
                          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                          <div className="text-center">
                              <p className="text-2xl font-black text-theme-text">24/7</p>
                              <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Support</p>
                          </div>
                          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                          <div className="text-center">
                              <p className="text-2xl font-black text-theme-text">100+</p>
                              <p className="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Projects</p>
                          </div>
                      </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl rotate-12 -z-10 opacity-40 blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full -z-10 opacity-40 blur-2xl animate-pulse animation-delay-2000"></div>
                  
                  {/* Floating Cursor/Badge */}
                  <div className="absolute -right-6 top-1/2 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce border border-gray-100 dark:border-slate-700">
                      <div className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                          <MousePointer className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-theme-text">Hire Me!</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-theme-text mb-4 tracking-tight">My Expert Services</h2>
            <p className="text-theme-muted text-lg">I offer a wide range of digital services to help your business grow. Choose a category below or browse all services.</p>
          </div>
          <Link to="/services" className="hidden md:flex items-center px-6 py-3 bg-white dark:bg-slate-800 text-theme-text rounded-full font-bold hover:text-premium-royal transition-all border border-gray-200 dark:border-slate-700 hover:border-premium-royal/30 hover:shadow-lg shadow-sm group">
            View All Services <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <Link to="/services" className="inline-flex items-center text-premium-royal font-bold text-lg">
            View All Services <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Why Hire Me */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-royal/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Why Hire Me?</h2>
              <p className="text-slate-400 text-lg">I deliver more than just a service; I deliver a partnership. Here is what you get when you work with me.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 p-10 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-2 hover:border-blue-500/50 group">
                 <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
                    <CheckCircle className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Direct Communication</h3>
                 <p className="text-slate-400 leading-relaxed">No middlemen. You speak directly with me to ensure your requirements are perfectly understood.</p>
              </div>
              <div className="bg-slate-800/50 p-10 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-2 hover:border-purple-500/50 group">
                 <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-500 group-hover:text-white transition-colors text-purple-400">
                    <Zap className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Fast Turnaround</h3>
                 <p className="text-slate-400 leading-relaxed">I respect your time. Get your projects delivered on time, every time, without compromising quality.</p>
              </div>
              <div className="bg-slate-800/50 p-10 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-2 hover:border-green-500/50 group">
                 <div className="bg-green-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-400">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Payment Security</h3>
                 <p className="text-slate-400 leading-relaxed">Secure payments via Stripe/PayPal. Funds are only released when you are 100% satisfied.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24 bg-theme-main relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-center text-theme-text mb-16 tracking-tight">Client Testimonials</h2>
            
            <div className="relative max-w-4xl mx-auto">
                {/* Slider Container */}
                <div className="overflow-hidden relative min-h-[350px] md:min-h-[300px]">
                    {TESTIMONIALS.map((t, index) => (
                        <div 
                          key={t.id}
                          className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out transform ${
                            index === activeTestimonial 
                                ? 'opacity-100 translate-x-0 relative z-10' 
                                : 'opacity-0 translate-x-12 pointer-events-none'
                          }`}
                        >
                            <div className="bg-theme-card p-8 md:p-12 rounded-[2rem] shadow-2xl border border-theme-border flex flex-col md:flex-row gap-8 items-center text-center md:text-left relative">
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-8 text-premium-royal/10">
                                    <Quote className="w-24 h-24 rotate-12" />
                                </div>

                                <div className="flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-full blur-lg opacity-30 transform scale-110"></div>
                                    <img 
                                        src={t.avatar} 
                                        alt={t.name} 
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg relative z-10" 
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-full z-20 shadow-md border-2 border-white dark:border-slate-800">
                                        <Quote className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-center md:justify-start text-yellow-400 mb-6 gap-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-xl md:text-2xl text-theme-text font-medium italic mb-6 leading-relaxed">
                                        "{t.text}"
                                    </p>
                                    <div>
                                        <h4 className="font-bold text-theme-text text-xl mb-1">{t.name}</h4>
                                        <p className="text-premium-royal font-semibold text-sm uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button 
                        onClick={prevTestimonial}
                        className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-theme-muted hover:text-premium-royal hover:scale-110 transition-all border border-theme-border group"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    
                    {/* Dots */}
                    <div className="flex justify-center gap-3">
                        {TESTIMONIALS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTestimonial(idx)}
                                className={`h-3 rounded-full transition-all duration-300 ${
                                    idx === activeTestimonial 
                                        ? 'bg-gradient-to-r from-premium-royal to-premium-indigo w-8' 
                                        : 'bg-gray-300 dark:bg-gray-700 w-3 hover:bg-premium-royal/50'
                                }`}
                                aria-label={`Go to testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={nextTestimonial}
                        className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-theme-muted hover:text-premium-royal hover:scale-110 transition-all border border-theme-border group"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      </section>
      
      {/* Newsletter Popup / Section */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-premium-royal to-premium-indigo rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
           {/* Glows */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 blur-[80px] rounded-full"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-30 blur-[80px] rounded-full"></div>

           <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to start your project?</h2>
              <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl font-medium">Join the newsletter to receive exclusive offers, development tips, and updates on my services.</p>
              <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 border-none placeholder-gray-500 font-medium" 
                 />
                 <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105">
                    Subscribe
                 </button>
              </form>
              <p className="mt-6 text-sm text-blue-200/80">No spam, unsubscribe at any time.</p>
           </div>
        </div>
      </section>
    </div>
  );
};
