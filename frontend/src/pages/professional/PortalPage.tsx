import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, UserCheck, AlertCircle, Award, Lightbulb } from 'lucide-react';
import api from '../../services/api';

const PortalPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/professionals/me/');
        setProfile(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Your professional profile has not been linked to your account yet.");
        } else {
          setError("An error occurred while loading your profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Unavailable</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  // Calculate simple recommendations based on readiness scores
  const getRecommendations = () => {
    const recs = [];
    if (profile.performance_score && profile.performance_score.toLowerCase().includes('pip')) {
      recs.push({ title: 'Performance Review', desc: 'Schedule a 1-on-1 with your manager to align on PIP objectives.' });
    }
    if (profile.training_outcome && profile.training_outcome.toLowerCase().includes('fail')) {
      recs.push({ title: 'Training Retake', desc: `Re-enroll in ${profile.training_program_name} to improve your readiness score.` });
    }
    if (profile.engagement_score && profile.engagement_score < 3) {
      recs.push({ title: 'Boost Engagement', desc: 'Consider joining an Employee Resource Group (ERG) or mentoring program.' });
    }
    if (recs.length === 0) {
      recs.push({ title: 'Keep it up!', desc: 'You have a healthy readiness profile. Keep looking for stretch assignments to continue growing.' });
    }
    return recs;
  };

  const ProgressBar = ({ label, value, max = 5, colorClass = "bg-blue-500" }: { label: string, value: number, max?: number, colorClass?: string }) => (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs font-bold text-slate-900">{value} / {max}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${(value / max) * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {profile.first_name}!</h1>
        <p className="text-slate-500 mt-1">Here is a summary of your career readiness and organizational standing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Personal Info & Details */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl mb-4">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profile.first_name} {profile.last_name}</h2>
            <p className="text-slate-500 font-medium mt-1">{profile.title}</p>
            
            <div className="mt-4 px-4 py-1.5 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200 inline-block">
              {profile.employee_status || 'Active'}
            </div>
          </motion.div>

          {/* Employment Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Employment Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Department</p>
                  <p className="font-medium text-slate-900 text-sm">{profile.department?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Employee ID</p>
                  <p className="font-medium text-slate-900 text-sm font-mono">{profile.employee_id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Manager Name</p>
                  <p className="font-medium text-slate-900 text-sm">{profile.manager_name || 'N/A'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE COLUMN: Metrics & Readiness */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Readiness Score Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-blue-600 rounded-2xl shadow-sm p-8 text-white relative overflow-hidden">
            {/* Decorative background shape */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <p className="text-blue-100 font-medium uppercase tracking-wider text-xs mb-2">Overall Readiness Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">{profile.readiness_score || 0}</span>
              <span className="text-blue-200 font-medium">/ 100</span>
            </div>
            <p className="mt-4 text-blue-100 text-sm max-w-md leading-relaxed">
              Your readiness score determines your eligibility for internal mobility, promotions, and cross-functional projects.
            </p>
          </motion.div>

          {/* Health Metrics & Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Organizational Health</h3>
              <ProgressBar 
                label="Engagement" 
                value={profile.engagement_score || 0} 
                colorClass="bg-indigo-500" 
              />
              <ProgressBar 
                label="Satisfaction" 
                value={profile.satisfaction_score || 0} 
                colorClass="bg-pink-500" 
              />
              <ProgressBar 
                label="Work-Life Balance" 
                value={profile.work_life_balance_score || 0} 
                colorClass="bg-teal-500" 
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Latest Training</h3>
                {profile.training_program_name ? (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">{profile.training_program_name}</p>
                        <p className="text-sm text-slate-600 mt-1">Outcome: <span className="font-bold">{profile.training_outcome}</span></p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No recent training recorded.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Performance</h3>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-slate-900">{profile.current_employee_rating || 'N/A'}</div>
                  <div className="text-xs text-slate-500 uppercase font-medium">/ 5 Current Rating</div>
                </div>
                {profile.performance_score && (
                  <p className="text-sm text-slate-600 mt-2 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100 inline-block">
                    {profile.performance_score}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Recommendations
            </h3>
            <div className="space-y-4">
              {getRecommendations().map((rec, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-sm shrink-0 border border-yellow-100">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
