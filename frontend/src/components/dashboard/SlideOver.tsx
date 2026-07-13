import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, Award, Activity, Heart, Clock } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  professional: any;
}

const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, professional }) => {
  if (!professional) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-lg font-semibold text-slate-800">Professional Profile</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shrink-0">
                  {professional.first_name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {professional.first_name} {professional.last_name}
                  </h3>
                  <p className="text-slate-500 font-medium">{professional.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${professional.employee_status?.toLowerCase().includes('active') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {professional.employee_status || 'Unknown'}
                    </span>
                    <span className="text-sm text-slate-400 font-mono">ID: {professional.employee_id}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Readiness Score</p>
                  <p className="text-2xl font-bold text-blue-600">{professional.readiness_score || 0}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-1">Current Rating</p>
                  <p className="text-2xl font-bold text-slate-800">{professional.current_employee_rating || 'N/A'}</p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Employment Details</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-500 text-xs">Department</p>
                      <p className="font-medium text-slate-800">{professional.department?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-500 text-xs">Location</p>
                      <p className="font-medium text-slate-800">{professional.state || 'N/A'} ({professional.location_code || 'N/A'})</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Health Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Heart size={16} />
                      <span>Satisfaction</span>
                    </div>
                    <span className="font-bold text-slate-900">{professional.satisfaction_score || 'N/A'} / 5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Activity size={16} />
                      <span>Engagement</span>
                    </div>
                    <span className="font-bold text-slate-900">{professional.engagement_score || 'N/A'} / 5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-white border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} />
                      <span>Work-Life Balance</span>
                    </div>
                    <span className="font-bold text-slate-900">{professional.work_life_balance_score || 'N/A'} / 5</span>
                  </div>
                </div>
              </div>
              
              {/* Training */}
              {professional.training_program_name && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Latest Training</h4>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900">{professional.training_program_name}</p>
                        <p className="text-sm text-blue-700 mt-1">Outcome: <span className="font-semibold">{professional.training_outcome}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                View Full Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideOver;
