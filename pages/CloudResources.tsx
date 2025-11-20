import React, { useState } from 'react';
import { MOCK_CLOUD_RESOURCES } from '../services/mockData';
import { ResourceType, CloudResource } from '../types';
import { RefreshCw, Server, Database, Layers } from 'lucide-react';

const CloudResources: React.FC = () => {
  const [activeType, setActiveType] = useState<ResourceType>(ResourceType.EC2);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredResources = MOCK_CLOUD_RESOURCES.filter(r => r.type === activeType);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000); // Simulate API call
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Cloud Resources</h1>
            <p className="text-slate-500 text-sm mt-1">AWS Account ID: 1234-5678-9012 (US-EAST-1)</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50"
        >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing with AWS..." : "Sync Resources"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200 rounded-xl w-fit">
        <ResourceTab 
            label="AWS EC2" 
            active={activeType === ResourceType.EC2} 
            onClick={() => setActiveType(ResourceType.EC2)} 
            icon={<Server size={16}/>}
        />
        <ResourceTab 
            label="AWS Redis" 
            active={activeType === ResourceType.REDIS} 
            onClick={() => setActiveType(ResourceType.REDIS)} 
            icon={<Layers size={16}/>}
        />
        <ResourceTab 
            label="AWS RDS" 
            active={activeType === ResourceType.RDS} 
            onClick={() => setActiveType(ResourceType.RDS)} 
            icon={<Database size={16}/>}
        />
      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Resource ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Spec</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Last Sync</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredResources.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{r.resourceId}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                            {r.name}
                            {r.ipAddress && <div className="text-xs text-slate-400 font-mono mt-1">{r.ipAddress}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{r.spec}</td>
                        <td className="px-6 py-4">
                            <StatusBadge status={r.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                            {new Date(r.updatedAt).toLocaleTimeString()}
                        </td>
                    </tr>
                ))}
                {filteredResources.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            No resources found for this category.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

const ResourceTab: React.FC<{ label: string, active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
        `}
    >
        {icon}
        {label}
    </button>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let colorClass = 'bg-slate-100 text-slate-600';
    if (status === 'running' || status === 'available') colorClass = 'bg-green-100 text-green-700';
    if (status === 'stopped') colorClass = 'bg-red-100 text-red-700';
    if (status === 'terminated') colorClass = 'bg-slate-200 text-slate-500 line-through';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${colorClass}`}>
            {status}
        </span>
    );
};

export default CloudResources;