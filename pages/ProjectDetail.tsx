import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Server, Activity, Clock, Users, Database } from 'lucide-react';
import { MOCK_PROJECTS, generateMiddlewareStats } from '../services/mockData';
import { MiddlewareStat, Project } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'middleware' | 'access'>('overview');
  const [stats, setStats] = useState<MiddlewareStat[]>([]);

  // Gemini AI State
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const found = MOCK_PROJECTS.find(p => p.id === id);
    if (found) {
      setProject(found);
      setStats(generateMiddlewareStats());
    }
  }, [id]);

  const handleAnalyzeLogs = async () => {
    if (!process.env.API_KEY) {
        alert("API_KEY environment variable missing for Gemini Demo.");
        return;
    }
    setIsAnalyzing(true);
    setAiAnalysis("");
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Prepare a summary of stats to send to Gemini
        const recentStats = stats.slice(-5);
        const prompt = `
          Analyze the following middleware metrics for the last 5 hours and provide a brief operational health summary and 3 recommendations for a DevOps engineer.
          Data: ${JSON.stringify(recentStats)}
          Output format: Markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        setAiAnalysis(response.text || "No analysis generated.");
    } catch (e) {
        console.error(e);
        setAiAnalysis("Failed to generate analysis. Check API Key or console logs.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  if (!project) return <div className="p-8 text-center">Loading project...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/projects" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{project.id}</span>
            <span>•</span>
            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="ml-auto">
            <Link to={`/projects/${id}/edit`} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm shadow-sm">
                Edit Project
            </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Activity size={18}/>} />
          <TabButton label="Middleware Resources" active={activeTab === 'middleware'} onClick={() => setActiveTab('middleware')} icon={<Server size={18}/>} />
          <TabButton label="Access Logs" active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={<Database size={18}/>} />
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-lg mb-4">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                  <p className="text-slate-700 mt-1">{project.description || "No description provided."}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Active Domains</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.domains.map(d => (
                      <a href={`https://${d}`} target="_blank" rel="noreferrer" key={d} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:underline decoration-blue-400">
                        {d}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Users size={20}/> Team</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-500">Owner</label>
                    <div className="flex items-center gap-2 mt-1">
                        <img src={project.owner.avatar} className="w-6 h-6 rounded-full"/>
                        <span className="text-sm font-medium">{project.owner.name}</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs text-slate-500">Admins</label>
                    <div className="mt-1 space-y-1">
                        {project.admins.map(u => (
                             <div key={u.id} className="flex items-center gap-2">
                                <img src={u.avatar} className="w-5 h-5 rounded-full opacity-80"/>
                                <span className="text-sm text-slate-700">{u.name}</span>
                             </div>
                        ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'middleware' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-4">CPU Usage (%)</h4>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" tickFormatter={(t) => t.split('T')[1].substring(0,5)} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-4">Memory Usage (%)</h4>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" tickFormatter={(t) => t.split('T')[1].substring(0,5)} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="memory" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Gemini Integration */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                        AI Health Analysis
                    </h3>
                    <button 
                        onClick={handleAnalyzeLogs}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {isAnalyzing ? "Analyzing..." : "Analyze with Gemini"}
                    </button>
                </div>
                {aiAnalysis ? (
                    <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                        <pre className="whitespace-pre-wrap font-sans">{aiAnalysis}</pre>
                    </div>
                ) : (
                    <p className="text-sm text-indigo-400 italic">Click analyze to generate insights based on recent metrics.</p>
                )}
            </div>
          </div>
        )}

        {activeTab === 'access' && (
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h4 className="font-semibold text-slate-700 mb-4">Incoming Traffic & Errors</h4>
               <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats}>
                            <defs>
                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="timestamp" tickFormatter={(t) => t.split('T')[1].substring(0,5)} />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="requests" stroke="#10b981" fillOpacity={1} fill="url(#colorReq)" />
                            <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
               </div>
           </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors border-b-2
      ${active 
        ? 'border-primary text-primary' 
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
    `}
  >
    {icon}
    {label}
  </button>
);

export default ProjectDetail;