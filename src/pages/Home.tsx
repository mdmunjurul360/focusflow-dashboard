/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from "../services/supabase";
import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  ShoppingBag, 
  MessageSquare, 
  Mail, 
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle,
  X,
  ImagePlus,
  Trash2
} from 'lucide-react';



// --- Types ---
type SectionId = 'signup' | 'login' | 'products' | 'feedback' | 'footer';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

// --- Constants ---
const PRODUCTS: Product[] = [
  { id: 1, name: "Aura Speaker", price: "$299", category: "Audio", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Nebula Chair", price: "$1,200", category: "Furniture", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Solar Watch", price: "$450", category: "Wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Prism Desk", price: "$850", category: "Furniture", image: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=400" },
];

const SECTION_ORDER: SectionId[] = ['signup', 'login', 'products', 'feedback', 'footer'];

// --- Components ---

const FocusSection = ({ 
  id, 
  activeId, 
  setActiveId, 
  children, 
  title,
  icon: Icon
}: { 
  id: SectionId; 
  activeId: SectionId; 
  setActiveId: (id: SectionId) => void; 
  children: ReactNode;
  title: string;
  icon: any;
}) => {
  const isActive = activeId === id;
  
  
  return (
    <motion.section
      onClick={() => setActiveId(id)}
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.95,
        filter: isActive ? 'blur(0px)' : 'blur(2px)',
      }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`relative w-full max-w-4xl mx-auto mb-24 p-8 rounded-3xl cursor-pointer transition-all duration-500
        ${isActive ? 'bg-slate-900 border-blue-500/50 shadow-[0_0_50px_rgba(37,99,235,0.15)]' : 'bg-slate-900/40 border-white/5 grayscale blur-[1px]'}
        border backdrop-blur-md`}
    >
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-500/40 z-20">
          Active Context: {title}
        </div>
      )}

      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-500'}`}>
            <Icon size={22} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>
              {title}
            </h2>
            {isActive && <p className="text-slate-400 text-sm mt-1">Terminal interface v4.0.1</p>}
          </div>
        </div>
        {!isActive && (
          <div className="hidden md:block px-4 py-2 bg-slate-800/50 rounded-lg text-xs font-mono text-slate-600 border border-white/5">
            DIMMED_MODE
          </div>
        )}
      </div>
      
      <div className={`transition-all duration-700 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {children}
      </div>
    </motion.section>
  );
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>('products');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to fetch session:', error);
        return;
      }
      setUser(data.session?.user ?? null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      console.log('USER:', session?.user);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error);
      return;
    }
    setUser(null);
  };

  // Feedback States
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackIsSending, setFeedbackIsSending] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<File | null>(null);
  const [feedbackImagePreview, setFeedbackImagePreview] = useState<string | null>(null);
  const feedbackFileInputRef = useRef<HTMLInputElement>(null);

  
  const handleFeedbackImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeedbackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSend = async () => {
    if (!feedbackMessage.trim() && !feedbackImage) return;
    
    setFeedbackIsSending(true);
    let imageUrl = '';

    try {
      if (feedbackImage) {
        const formData = new FormData();
        formData.append('image', feedbackImage);
        
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!apiKey || apiKey === "YOUR_IMGBB_API_KEY") {
           console.warn("ImgBB API Key is missing. Skipping actual upload.");
           // Mock upload success
           await new Promise(resolve => setTimeout(resolve, 1500));
           imageUrl = 'https://i.ibb.co/example/image.png';
        } else {
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.success) {
            imageUrl = data.data.url;
          } else {
            throw new Error(data.error.message || 'Upload failed');
          }
        }
      }

      // Simulate sending feedback data with imageUrl
      console.log('Sending Feedback:', { message: feedbackMessage, imageUrl });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFeedbackIsSending(false);
      setFeedbackMessage('');
      setFeedbackImage(null);
      setFeedbackImagePreview(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setFeedbackIsSending(false);
      // In a real app we'd show an error toast here
      alert("Error sending feedback. Check console for details.");
    }
  };
  
  const handleSend = () => {
    if (!message.trim()) return;
    setIsSending(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSending(false);
      setMessage('');
      setShowToast(true);
      // Auto hide toast
      setTimeout(() => setShowToast(false), 5000);
    }, 1500);
  };
  
  // Keyboard navigation for fun
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = SECTION_ORDER.indexOf(activeSection);
      if (e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % SECTION_ORDER.length;
        setActiveSection(SECTION_ORDER[nextIndex]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIndex = (currentIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length;
        setActiveSection(SECTION_ORDER[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden flex flex-col">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      {/* Modern Header */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white italic">MUNJURUL</span>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="text-blue-400 cursor-pointer">Protocol</span>
          <span className="hover:text-white cursor-pointer transition-colors">Archive</span>
          <span className="hover:text-white cursor-pointer transition-colors">Neural</span>
          <span className="hover:text-white cursor-pointer transition-colors">Registry</span>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block px-3 py-1 bg-slate-900 rounded-md border border-white/5 text-[10px] font-mono text-blue-400">
            {user ? 'AUTH: LOGGED IN' : 'AUTH: GUEST'}
          </div>
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-slate-300">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <UserPlus size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Hero Header */}
      <header className="relative pt-40 pb-20 text-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1 mb-8 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-blue-400">High Fidelity Interface</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent italic">
            MUNJURUL
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
            A specialized computing environment designed for deep focus. <br/> Integrated. Secure. Professional.
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 pb-40 px-4 flex-1">
        
        {/* Signup Section */}
<FocusSection
  id="signup"
  activeId={activeSection}
  setActiveId={setActiveSection}
  title="Registry Entry"
  icon={UserPlus}
>
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Onboarding Protocol</h3>
        <p className="text-slate-400 font-light">Initialize your presence within the Munjurul network infrastructure.</p>
      </div>
     
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">E-Mail Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-slate-800 rounded-xl border border-white/5 px-4 py-3 text-white"
        />
      </div>

      {/* 🔥 EMAIL SIGNUP (simple alert for now) */}
      <button
        onClick={() => alert("Email signup later connect korbo")}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <span>Begin Authentication</span>
      </button>
     
      <div className="flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-white/5" />
        <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">OR Federated Identity</span>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      {/* 🔥 GOOGLE SIGNUP (REAL WORKING) */}
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
          });
          if (error) alert(error.message);
        }}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all active:scale-95"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Identity: Google</span>
      </button>
    </div>

    <div className="hidden md:block">
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-950/20 flex items-center justify-center border border-white/5 p-12">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-2 border-blue-500/20 rounded-[40px] flex items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
          <UserPlus size={64} className="text-blue-500/30 relative z-10" />
        </motion.div>
      </div>
    </div>
  </div>
</FocusSection>

        {/* Login Section */}
<FocusSection
  id="login"
  activeId={activeSection}
  setActiveId={setActiveSection}
  title="Access Node"
  icon={LogIn}
>
  <div className="max-w-md mx-auto">
    <div className="text-center mb-10">
      <h3 className="text-3xl font-bold mb-2">Systems Online</h3>
      <p className="text-slate-500 text-sm">Please verify your security credentials to proceed.</p>
    </div>
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Identity Tag</label>
        <input
          type="email"
          placeholder="NODE_TAG@MUNJURUL.SYS"
          className="w-full bg-slate-800/80 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500/30 transition-all text-sm font-mono placeholder:text-slate-600"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Security Key</label>
          <span className="text-[10px] uppercase tracking-widest text-blue-500/60 font-bold cursor-pointer hover:text-blue-400">Lost Key?</span>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full bg-slate-800/80 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500/30 transition-all tracking-widest"
        />
      </div>

      {/* 🔥 FIXED BUTTON */}
      <button
        onClick={() => alert("Login working")}
        className="w-full py-4 mt-4 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 group hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
      >
        <span>Access System</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  </div>
</FocusSection>

        {/* Products Section */}
        <FocusSection 
          id="products" 
          activeId={activeSection} 
          setActiveId={setActiveSection}
          title="Premium Hardware"
          icon={ShoppingBag}
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h4 className="text-xl font-bold text-white">Product Catalog</h4>
              <p className="text-slate-500 text-sm mt-1">High-performance lineup for edge computation.</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-[10px] font-mono text-blue-400 border border-white/5">
                REF_ID: 4992-BX
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -8 }}
                className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center overflow-hidden relative">
                   <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</h4>
                     <span className="text-blue-400 font-mono text-xs">{p.price}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-4">{p.category} certified module.</p>
                  <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/10 transition-all active:scale-95">
                    Configure
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </FocusSection>

        {/* Feedback Section */}
        <FocusSection 
          id="feedback" 
          activeId={activeSection} 
          setActiveId={setActiveSection}
          title="System Feedback"
          icon={MessageSquare}
        >
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white leading-tight">Optimization <br/> Loop.</h3>
                <p className="text-slate-500 font-light max-w-sm">How can we improve the interface for your specific neural workflows?</p>
              </div>
              <div className="space-y-4">
                {[
                  { text: "Operational precision reports" },
                  { text: "Latency reduction suggestions" },
                  { text: "Stability audit request" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-white/10 shadow-inner">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Analysis Input</label>
                  <textarea 
                    rows={4}
                    placeholder="Input detailed observations..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full bg-slate-800 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500/30 transition-all resize-none text-slate-300 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Evidence Capture</label>
                  <div className="flex gap-4 items-start">
                    {!feedbackImagePreview ? (
                      <button 
                         onClick={() => feedbackFileInputRef.current?.click()}
                         className="flex-1 h-32 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500/30 hover:text-blue-400 transition-all group"
                      >
                        <ImagePlus size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Attach Image</span>
                      </button>
                    ) : (
                      <div className="relative group flex-1">
                        <img 
                          src={feedbackImagePreview} 
                          alt="Feedback" 
                          className="w-full h-32 object-cover rounded-xl border border-white/10" 
                        />
                        <button 
                          onClick={() => {
                            setFeedbackImage(null);
                            setFeedbackImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={feedbackFileInputRef}
                      onChange={handleFeedbackImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleFeedbackSend}
                  disabled={feedbackIsSending || (!feedbackMessage.trim() && !feedbackImage)}
                  className="w-full py-4 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center gap-2 group hover:bg-slate-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {feedbackIsSending ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white/50" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Analysis</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </FocusSection>

        {/* Footer Section */}
        <FocusSection 
          id="footer" 
          activeId={activeSection} 
          setActiveId={setActiveSection}
          title="Contact"
          icon={Mail}
        >
          <div className="grid md:grid-cols-2 gap-20 py-10">
            {/* Left Side: Socials */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-white tracking-tight">Get in touch.</h3>
                <p className="text-slate-500 font-light max-w-sm">
                  Connecting across all digital frequencies. Access my social nodes below.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Facebook, label: "Facebook", color: "hover:text-blue-500" },
                  { icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-400" },
                  { icon: Github, label: "GitHub", color: "hover:text-white" },
                  { icon: Youtube, label: "YouTube", color: "hover:text-red-500" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 text-slate-400 font-medium tracking-wide transition-colors ${social.color}`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 group-hover:border-white/20">
                      <social.icon size={18} />
                    </div>
                    <span className="text-sm">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="relative">
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Write your message</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Transmission starts here..."
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500/30 transition-all resize-none text-slate-300 text-sm placeholder:text-slate-700"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSend}
                    disabled={isSending || !message.trim()}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 group hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white/50" />
                        <span className="uppercase tracking-widest text-sm">Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="uppercase tracking-widest text-sm">Send Message</span>
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Toast Notification Simulation */}
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -bottom-24 left-0 right-0 p-4 bg-emerald-500 rounded-2xl text-white flex items-center justify-between shadow-2xl shadow-emerald-500/20 z-50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">Transmission Success</span>
                        <span className="text-[10px] opacity-80 mt-1">Message encrypted and delivered to support.</span>
                      </div>
                    </div>
                    <button onClick={() => setShowToast(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-20 pb-10 flex justify-center border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">
              © 2026 Munjurul. All rights reserved.
            </p>
          </div>
        </FocusSection>
      </main>

      {/* Main Footer Fixed - Simple/Minimal */}
      <footer className="relative mt-auto h-12 flex items-center justify-center px-10 border-t border-white/5 text-[10px] text-slate-700 tracking-[0.5em] font-mono bg-slate-950/80 backdrop-blur-sm z-20">
        SYSTEM_CONNECTED // MUNJURUL_PROTOCOL
      </footer>
      
      {/* Scroll Navigation Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-5">
        {SECTION_ORDER.map((id) => (
          <div key={id} className="group relative flex items-center justify-end">
            <span className={`absolute right-6 px-2 py-1 rounded bg-blue-600 text-[8px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-2 group-hover:translate-x-0`}>
              {id}
            </span>
            <button
              onClick={() => setActiveSection(id)}
              className={`w-2 h-2 rounded-full transition-all duration-500 border-2
                ${activeSection === id ? 'bg-blue-600 border-blue-600 scale-150 shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-transparent border-white/20 group-hover:border-white/60'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
