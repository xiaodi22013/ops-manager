import React from 'react';
import { Layout } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { MOCK_PROJECTS, MOCK_CLOUD_RESOURCES } from '../services/mockData';
import { ResourceType } from '../types';

const Dashboard: React.FC = () => {
  const projectCount = MOCK_PROJECTS.length;
  const resourceCount = MOCK_CLOUD_RESOURCES.length;
  const runningEc2 = MOCK_CLOUD_RESOURCES.filter(r => r.type === ResourceType.EC2 && r.status === 'running').length;
  const alerts = 3; // Mock alert count

  // Mock Data for Charts
  const resourceData = [
    { name: 'EC2', count: MOCK_CLOUD_RESOURCES.filter(r => r.type === ResourceType.EC2).length },
    { name: 'RDS', count: MOCK_CLOUD_RESOURCES.filter(r => r.type === ResourceType.RDS).length },
    { name: 'Redis', count: MOCK_CLOUD_RESOURCES.filter(r => r.type === ResourceType.REDIS).length },
  ];

  const trafficData = [
    { time: '00:00', requests: 400 }, { time: '04:00', requests: 300 },
    { time: '08:00', requests: 1200 }, { time: '12:00', requests: 2400 },
    { time: '16:00', requests: 1800 }, { time: '20:00', requests: 900 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={projectCount} color="bg-blue-500" />
        <StatCard title="Cloud Resources" value={resourceCount} color="bg-indigo-500" />
        <StatCard title="Running EC2" value={runningEc2} color="bg-green-500" />
        <StatCard title="Active Alerts" value={alerts} color="bg-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Cloud Resource Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Global Request Volume (24h)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
    <div className={`w-3 h-12 rounded-full ${color} opacity-20`}></div>
  </div>
);

export default Dashboard;