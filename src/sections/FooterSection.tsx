import { useState, useRef, useEffect } from 'react';
import { FadeIn } from '../components/FadeIn';
import { useSiteContent } from '../hooks/useSiteContent';

const GithubIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16.11 7.66v.01"/><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>;
const FacebookIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;

const TikTokIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512" fill="currentColor" className={className}><path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>;

export const FooterSection = () => {
  const { content } = useSiteContent('footer');
  const [formData, setFormData] = useState({
    senderEmail: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!formData.senderEmail || !formData.subject || !formData.message) {
      setErrorMsg('Please fill out all fields before sending.');
      return;
    }

    if (!isValidEmail(formData.senderEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch("https://formsubmit.co/ajax/mohamed.ghanem.work@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: formData.senderEmail,
            subject: formData.subject,
            message: formData.message,
            _subject: "New Message from Portfolio: " + formData.subject
        })
      });

      if (response.ok) {
        setFormData({ senderEmail: '', subject: '', message: '' });
        setStatus('sent');
        timerRef.current = setTimeout(() => setStatus('idle'), 5000);
      } else {
        setErrorMsg('Failed to send message. Please try again.');
        setStatus('idle');
      }
    } catch {
      // Fallback: If fetch fails (usually due to AdBlockers blocking formsubmit.co), 
      // submit as a standard HTML form which navigates to their page but works reliably.
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formsubmit.co/mohamed.ghanem.work@gmail.com';
      form.target = '_blank'; // Open in new tab to preserve the portfolio page
      
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = formData.senderEmail;
      
      const subjectInput = document.createElement('input');
      subjectInput.type = 'hidden';
      subjectInput.name = 'subject';
      subjectInput.value = formData.subject;
      
      const messageInput = document.createElement('input');
      messageInput.type = 'hidden';
      messageInput.name = 'message';
      messageInput.value = formData.message;

      const nextInput = document.createElement('input');
      nextInput.type = 'hidden';
      nextInput.name = '_next';
      nextInput.value = window.location.href; // Try to redirect back

      form.appendChild(emailInput);
      form.appendChild(subjectInput);
      form.appendChild(messageInput);
      form.appendChild(nextInput);
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setFormData({ senderEmail: '', subject: '', message: '' });
      setStatus('sent');
      timerRef.current = setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const socials = [
    { 
      name: 'GitHub', 
      url: 'https://github.com/mohamedghanem-ai', 
      icon: GithubIcon,
      bgGlow: 'bg-[#24292e]/60',
      shadow: 'shadow-[0_10px_40px_rgba(100,110,120,0.5),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_15px_60px_rgba(150,160,170,0.6),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(0,0,0,0.9)]'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/mohamedghanem-ai', 
      icon: LinkedinIcon,
      bgGlow: 'bg-[#0A66C2]/60',
      shadow: 'shadow-[0_10px_40px_rgba(10,102,194,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(4,48,94,0.9)] hover:shadow-[0_15px_60px_rgba(10,102,194,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(4,48,94,0.9)]'
    },
    { 
      name: 'YouTube', 
      url: 'https://youtube.com/@mohamedghanem-ai?si=8wVq4mNt492xiz40', 
      icon: YoutubeIcon,
      bgGlow: 'bg-red-600/60',
      shadow: 'shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.9)] hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.9)]'
    },
    { 
      name: 'TikTok', 
      url: 'https://www.tiktok.com/@mohamedghanem.ai?_r=1&_t=ZS-98cNLUfLkpD', 
      icon: TikTokIcon,
      bgGlow: 'bg-[#111111]/70',
      shadow: 'shadow-[0_10px_40px_rgba(254,44,85,0.7),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(0,0,0,0.9)] hover:shadow-[0_15px_60px_rgba(37,244,238,0.9),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(0,0,0,0.9)]'
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/mohamedghanem.ai?igsh=MWYzd2hkY29iYmZiZQ==', 
      icon: InstagramIcon,
      bgGlow: 'bg-gradient-to-tr from-[#f09433]/70 via-[#e6683c]/70 to-[#bc1888]/70',
      shadow: 'shadow-[0_10px_40px_rgba(225,48,108,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(130,15,55,0.9)] hover:shadow-[0_15px_60px_rgba(225,48,108,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(130,15,55,0.9)]'
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/share/19Getqzsbt/', 
      icon: FacebookIcon,
      bgGlow: 'bg-[#1877F2]/60',
      shadow: 'shadow-[0_10px_40px_rgba(24,119,242,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(8,60,130,0.9)] hover:shadow-[0_15px_60px_rgba(24,119,242,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(8,60,130,0.9)]'
    }
  ];

  return (
    <footer id="contact" className="w-full bg-[#050505] py-12 md:py-20 px-6 md:px-10 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#E60000]/50 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <FadeIn y={20}>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            {content?.title || "Let's Connect"}
          </h2>
        </FadeIn>
        
        <FadeIn delay={0.1} y={20}>
          <p className="text-[#A0AAB2] text-center max-w-lg mb-12 text-sm md:text-base">
            {content?.description || "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions."}
          </p>
        </FadeIn>
        
        <FadeIn delay={0.2} y={20} className="w-full">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center w-full gap-3 sm:gap-4 md:gap-6 px-1 sm:px-0">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex justify-center items-center gap-2 sm:gap-3 w-full sm:w-[150px] md:w-[170px] py-3.5 rounded-[20px] sm:rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:brightness-110 backface-hidden transform-gpu backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)] ${social.bgGlow} ${social.shadow}`}
                >
                  <Icon className={`relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 text-white drop-shadow-md shrink-0`} />
                  <span className={`relative z-10 font-extrabold tracking-wider text-[10px] sm:text-xs md:text-sm uppercase text-white drop-shadow-md whitespace-nowrap`}>
                    {social.name}
                  </span>
                </a>
              );
            })}
          </div>
        </FadeIn>
        
        <FadeIn delay={0.4} y={20} className="w-full mt-24">
          <div className="relative p-[1px] rounded-[2rem] overflow-hidden group">
            {/* Animated glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E60000]/50 to-transparent opacity-50"></div>
            
            <div 
              className="relative bg-[#0A0A0A] rounded-[2rem] p-8 md:p-12 border border-white/10 flex flex-col gap-6 shadow-2xl"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">Send a Message</h3>
                <p className="text-[#A0AAB2] mt-2 text-sm">Reach out directly via email</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold ml-1">Your Email</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                    className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]/50 transition-all duration-300 shadow-inner"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-subject" className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold ml-1">Subject</label>
                  <input 
                    id="contact-subject"
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]/50 transition-all duration-300 shadow-inner"
                    placeholder="What is this about?"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold ml-1">Message</label>
                <textarea 
                  id="contact-message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]/50 transition-all duration-300 resize-none shadow-inner"
                  placeholder="Hello Mohamed, I would like to discuss..."
                />
              </div>

              {/* Inline error message */}
              {errorMsg && (
                <p className="text-red-400 text-sm text-center -mt-2 animate-pulse">{errorMsg}</p>
              )}

              <button 
                type="button"
                onClick={handleSubmit}
                disabled={status !== 'idle'}
                className={`relative overflow-hidden mt-4 w-full text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 ${
                  status === 'sent' 
                    ? 'bg-green-500/60 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(0,255,0,0.6),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(0,150,0,0.8)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)]' 
                    : 'bg-red-600/50 backdrop-blur-xl border border-white/40 border-t-white/90 border-b-black/40 shadow-[0_10px_40px_rgba(255,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.7),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:scale-105 hover:bg-red-500/60 hover:shadow-[0_15px_60px_rgba(255,0,0,1),_inset_0_4px_15px_rgba(255,255,255,0.9),_inset_0_-6px_12px_rgba(150,0,0,0.8)] hover:brightness-110 active:scale-95 active:shadow-[0_5px_20px_rgba(255,0,0,0.8),_inset_0_1px_5px_rgba(255,255,255,0.5),_inset_0_6px_12px_rgba(150,0,0,0.9)] [text-shadow:0px_0px_8px_rgba(255,255,255,0.9)]'
                }`}
              >
                <span className="relative z-10 drop-shadow-md">
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent Successfully! ✅' : 'Send Email'}
                </span>
              </button>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.6} y={20} className="mt-24 text-center">
          <p className="text-[#64748B] text-xs md:text-sm font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} Mohamed Ghanem. All rights reserved.
          </p>
        </FadeIn>
      </div>
    </footer>
  );
};

