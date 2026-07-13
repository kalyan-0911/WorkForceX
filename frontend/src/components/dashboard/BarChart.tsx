import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  categoryKey: string;
  title: string;
  layout?: 'horizontal' | 'vertical';
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3 text-sm">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-blue-600 font-medium">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const BarChart: React.FC<BarChartProps> = ({ data, dataKey, categoryKey, title, layout = 'horizontal' }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[350px]">
      <h3 className="text-base font-semibold text-slate-800 mb-6">{title}</h3>
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 0, right: 20, left: layout === 'vertical' ? 100 : 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={layout === 'horizontal'} horizontal={layout === 'vertical'} stroke="#f1f5f9" />
            
            {layout === 'horizontal' ? (
              <>
                <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
              </>
            ) : (
              <>
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis dataKey={categoryKey} type="category" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} width={120} />
              </>
            )}
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            
            <Bar dataKey={dataKey} radius={[4, 4, 4, 4]} name="Count">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
