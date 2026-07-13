import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <div className="text-blue-500 bg-blue-50 p-2 rounded-lg">{icon}</div>}
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
