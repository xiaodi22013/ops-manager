import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { MOCK_PROJECTS } from '../services/mockData';
import { Project } from '../types';

const ProjectList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('');

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.domains.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesOwner = filterOwner ? project.owner.name.toLowerCase().includes(filterOwner.toLowerCase()) : true;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        <Link to="/projects/new" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name or Domain..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="relative w-full md:w-64">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
            type="text" 
            placeholder="Filter by Owner..."
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
           />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Domains</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">People</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Last Updated</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{project.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{project.name}</div>
                    <div className="text-xs text-slate-500 md:hidden">{project.owner.name}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.domains.slice(0, 3).map((d, i) => (
                        <span key={i} className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs border border-blue-100">
                          {d}
                        </span>
                      ))}
                      {project.domains.length > 3 && (
                         <span className="inline-block px-2 py-0.5 text-slate-400 text-xs">...</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img title={`Owner: ${project.owner.name}`} src={project.owner.avatar} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt={project.owner.name} />
                      {project.developers.slice(0, 2).map((dev, i) => (
                         <img key={i} title={`Dev: ${dev.name}`} src={dev.avatar} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt={dev.name} />
                      ))}
                       {(project.developers.length + project.admins.length) > 3 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-xs font-medium text-slate-500">
                          +{(project.developers.length + project.admins.length) - 2}
                        </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/projects/${project.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </Link>
                      <Link to={`/projects/${project.id}/edit`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No projects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;