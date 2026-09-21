import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader } from 'lucide-react';

export interface SiteContent {
  section_id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  updated_at?: string;
}

export const ContentManager = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_content').select('section_id, title, subtitle, description, updated_at');
    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      // Sort by website order: hero -> services -> projects -> about -> footer
      const order = ['hero', 'services', 'projects', 'about', 'footer'];
      const sortedData = [...data]
        .filter(c => c.section_id !== 'contact') // Contact is handled by footer now
        .sort((a, b) => {
          const indexA = order.indexOf(a.section_id);
          const indexB = order.indexOf(b.section_id);
          return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
      });
      setContent(sortedData);
    }
    setLoading(false);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setContent(content.map(c => c.section_id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setErrorMsg('');
    const item = content.find(c => c.section_id === id);
    if (item) {
      const { error } = await supabase.from('site_content').update({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        updated_at: new Date()
      }).eq('section_id', id);

      if (error) setErrorMsg(error.message);
    }
    setSavingId(null);
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
          Content Manager
        </h2>
        <p className="text-[#A0AAB2] text-sm mt-1">Update website text dynamically</p>
      </div>
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-[#A0AAB2]">Loading content...</div>
      ) : content.length === 0 ? (
        <div className="text-center py-10 text-[#A0AAB2] border border-dashed border-white/10 rounded-2xl">
          No content found. Please run the SQL setup script.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {content.map((section) => (
            <div key={section.section_id} className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <h3 className="text-lg font-black uppercase text-[#E60000]">{section.section_id} Section</h3>
                <button 
                  onClick={() => handleSave(section.section_id)} 
                  disabled={savingId === section.section_id}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50"
                >
                  {savingId === section.section_id ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {/* Title is used by all sections */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">
                    {section.section_id === 'hero' ? 'Main Name' : 'Main Title'}
                  </label>
                  <input 
                    type="text" 
                    value={section.title || ''} 
                    onChange={e => handleUpdate(section.section_id, 'title', e.target.value)} 
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors" 
                  />
                </div>
                
                {/* Subtitle is only used by Hero */}
                {section.section_id === 'hero' && section.subtitle !== null && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Subtitle / Tagline</label>
                    <input 
                      type="text" 
                      value={section.subtitle || ''} 
                      onChange={e => handleUpdate(section.section_id, 'subtitle', e.target.value)} 
                      className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors" 
                    />
                  </div>
                )}

                {/* Description is only used by Hero, About, and Footer */}
                {['hero', 'about', 'footer'].includes(section.section_id) && section.description !== null && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[#A0AAB2] uppercase tracking-widest font-bold">Description / Paragraph</label>
                    <textarea 
                      rows={4}
                      value={section.description || ''} 
                      onChange={e => handleUpdate(section.section_id, 'description', e.target.value)} 
                      className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors resize-none" 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
