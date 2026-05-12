import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import * as LucideIcons from 'lucide-react';

// Safe Icon Component to prevent "undefined component" crashes
const Icon = ({ name, className = "w-4 h-4" }) => {
  const Component = LucideIcons[name] || LucideIcons.Globe || (() => <div className={className} />);
  return <Component className={className} />;
};

export default function ProfileSettings() {
  const { user, fetchProfile } = useOutletContext();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    education: user.education || '',
    twitter: user.socialLinks?.twitter || '',
    linkedin: user.socialLinks?.linkedin || '',
    github: user.socialLinks?.github || ''
  });
  const [preview, setPreview] = useState(user.profilePicture);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('profilePicture', file);

      await api.put('/users/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchProfile();
      showToast("Profile updated successfully!", "success");
      navigate(`/user/${user._id}`);
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
          <Icon name="ArrowLeft" className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Profile Settings</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Customize your EduConnect identity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="w-full h-full rounded-[32px] overflow-hidden bg-slate-50 border-4 border-white shadow-xl">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-600">
                    {user.name[0]}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl cursor-pointer shadow-lg shadow-indigo-100 hover:scale-110 transition-all">
                <Icon name="Camera" className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               Social Links
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Icon name="Twitter" className="w-4 h-4 text-sky-500" />
                <input 
                  name="twitter" value={formData.twitter} onChange={handleChange}
                  placeholder="Twitter URL" className="bg-transparent flex-1 text-sm font-bold focus:outline-none" 
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Icon name="Linkedin" className="w-4 h-4 text-blue-600" />
                <input 
                  name="linkedin" value={formData.linkedin} onChange={handleChange}
                  placeholder="LinkedIn URL" className="bg-transparent flex-1 text-sm font-bold focus:outline-none" 
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Icon name="Github" className="w-4 h-4 text-slate-900" />
                <input 
                  name="github" value={formData.github} onChange={handleChange}
                  placeholder="GitHub URL" className="bg-transparent flex-1 text-sm font-bold focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon name="Users" className="w-4 h-4" /> Full Name
              </label>
              <input 
                name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon name="Camera" className="w-4 h-4" /> Short Bio
              </label>
              <textarea 
                name="bio" rows="4" value={formData.bio} onChange={handleChange}
                placeholder="Tell the community about yourself..."
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon name="GraduationCap" className="w-4 h-4" /> Education / Credentials
              </label>
              <textarea 
                name="education" rows="3" value={formData.education} onChange={handleChange}
                placeholder="Where did you study? What are your certifications?"
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/10 font-medium transition-all" 
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-6 rounded-[24px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-50"
            >
              <Icon name="Save" className="w-6 h-6" /> {loading ? "Updating..." : "Save Profile Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
