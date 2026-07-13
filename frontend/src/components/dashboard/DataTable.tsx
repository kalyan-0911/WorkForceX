import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import api from '../../services/api';

interface DataTableProps {
  onRowClick: (professional: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onRowClick }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProfessionals = async (currentPage: number, searchQuery: string) => {
    setLoading(true);
    try {
      const response = await api.get('/professionals/', {
        params: {
          page: currentPage,
          search: searchQuery
        }
      });
      setData(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 20)); // DRF default PAGE_SIZE=20
    } catch (error) {
      console.error("Failed to fetch professionals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1);
      fetchProfessionals(1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page > 1 || !search) {
      fetchProfessionals(page, search);
    }
  }, [page]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Professional Directory</h3>
          <p className="text-sm text-slate-500">Showing {data.length} of {totalCount} total</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="px-6 py-4">Professional</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-right">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading directory...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No professionals found matching your search.
                </td>
              </tr>
            ) : (
              data.map((prof) => (
                <tr 
                  key={prof.id} 
                  onClick={() => onRowClick(prof)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                        {prof.first_name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                          {prof.first_name} {prof.last_name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">ID: {prof.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{prof.title || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {prof.department?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-slate-900">{prof.readiness_score || 0}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <span className="text-sm text-slate-500 font-medium">Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 rounded-lg transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DataTable;
