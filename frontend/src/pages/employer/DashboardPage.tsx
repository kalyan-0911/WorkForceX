import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import BarChart from '../../components/dashboard/BarChart';
import DataTable from '../../components/dashboard/DataTable';
import SlideOver from '../../components/dashboard/SlideOver';
import { Users, Briefcase, Activity, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/professionals/dashboard/summary/');
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Loading dashboard insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.first_name}. Here is what's happening across the workforce today.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Professionals" 
          value={summary.total_professionals.toLocaleString()} 
          icon={<Users size={20} />} 
          delay={0.1}
        />
        <StatCard 
          title="Active Professionals" 
          value={summary.active_professionals.toLocaleString()} 
          icon={<CheckCircle size={20} />} 
          delay={0.2}
        />
        <StatCard 
          title="Avg Readiness Score" 
          value={summary.avg_readiness_score} 
          icon={<Activity size={20} />} 
          delay={0.3}
        />
        <StatCard 
          title="Total Departments" 
          value={summary.total_departments} 
          icon={<Briefcase size={20} />} 
          delay={0.4}
        />
      </div>

      {/* Main Grid: Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChart 
              title="Top 5 Departments (Headcount)" 
              data={summary.top_departments} 
              dataKey="count" 
              categoryKey="name"
              layout="vertical"
            />
            <BarChart 
              title="Avg Readiness by Top Titles" 
              data={summary.top_titles} 
              dataKey="count" 
              categoryKey="title"
              layout="vertical"
            />
          </div>
        </div>

        {/* Right Col: Smart Insights */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
            <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Workforce Insights
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Highest Readiness</p>
                <p className="text-slate-900 font-medium">{summary.highest_readiness_department}</p>
                <p className="text-xs text-slate-400 mt-1">Leading department globally</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Largest Department</p>
                <p className="text-slate-900 font-medium">{summary.largest_department}</p>
                <p className="text-xs text-slate-400 mt-1">Most densely populated</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Most Common Title</p>
                <p className="text-slate-900 font-medium">{summary.most_common_title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Directory Table */}
      <div>
        <DataTable onRowClick={setSelectedProfessional} />
      </div>

      {/* Professional SlideOver */}
      <SlideOver 
        isOpen={!!selectedProfessional} 
        onClose={() => setSelectedProfessional(null)} 
        professional={selectedProfessional} 
      />
    </div>
  );
};

export default DashboardPage;
