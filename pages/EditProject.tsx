import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_USERS } from '../services/mockData';
import { Project, UserRole } from '../types';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (id === 'new') {
       setFormData({
           id: `P-${Math.floor(Math.random()*10000)}`,
           name: '',
           domains: [],
           owner: MOCK_USERS[0],
           developers: [],
           admins: [],
           updatedAt: new Date().toISOString(),
           description: ''
       });
    } else {
        const found = MOCK_PROJECTS.find(p => p.id === id);
        if (found) setFormData({ ...found });
    }
  }, [id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Data saved! (Mock implementation)");
    navigate('/projects');
  };

  const toggleUser = (userId: string, field: 'developers' | 'admins') => {
    if (!formData) return;
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) return;

    const currentList = formData[field];
    const exists = currentList.some(u => u.id === userId);

    let newList;
    if (exists) {
        newList = currentList.filter(u => u.id !== userId);
    } else {
        newList = [...currentList, user];
    }
    setFormData({ ...formData, [field]: newList });
  };

  if (!formData) return <div>Loading...</div>;

  const allDevs = MOCK_USERS.filter(u => u.role === UserRole.DEV || u.role === UserRole.ADMIN);
  const allAdmins = MOCK_USERS.filter(u => u.role === UserRole.ADMIN);

  return (
    <div className="max-w-4xl mx-auto">
       <div className="flex items-center gap-4 mb-6">
        <Link to="/projects" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">{id === 'new' ? 'New Project' : 'Edit Project'}</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-slate-100 pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Project ID</label>
                     <input 
                        type="text" 
                        disabled
                        value={formData.id}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                        rows={3}
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                    />
                </div>
            </div>
        </div>

        {/* Team Management */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-slate-100 pb-2">Team Roles (Bulk Update)</h3>
            
            {/* Developers Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Developers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allDevs.map(user => (
                        <div 
                            key={user.id}
                            onClick={() => toggleUser(user.id, 'developers')}
                            className={`
                                cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition-all
                                ${formData.developers.some(d => d.id === user.id) 
                                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                    : 'border-slate-200 hover:bg-slate-50'}
                            `}
                        >
                            <input type="checkbox" checked={formData.developers.some(d => d.id === user.id)} readOnly className="accent-blue-600" />
                            <div className="flex items-center gap-2 overflow-hidden">
                                <img src={user.avatar} className="w-6 h-6 rounded-full" alt=""/>
                                <span className="text-sm truncate">{user.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Admins Selection */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Managers / Admins</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allAdmins.map(user => (
                        <div 
                            key={user.id}
                            onClick={() => toggleUser(user.id, 'admins')}
                            className={`
                                cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition-all
                                ${formData.admins.some(d => d.id === user.id) 
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                    : 'border-slate-200 hover:bg-slate-50'}
                            `}
                        >
                            <input type="checkbox" checked={formData.admins.some(d => d.id === user.id)} readOnly className="accent-indigo-600" />
                            <div className="flex items-center gap-2 overflow-hidden">
                                <img src={user.avatar} className="w-6 h-6 rounded-full" alt=""/>
                                <span className="text-sm truncate">{user.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Save size={18} />
                Save Changes
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;