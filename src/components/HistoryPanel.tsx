import React, { useState, useEffect } from 'react';
import { Scan } from '../types';
import { getAllScans, updateScanTitle, deleteScan } from '../services/scanHistoryService';
import { History, Edit2, Trash2, Check, X, Calendar, MapPin } from 'lucide-react';

interface HistoryPanelProps {
  onLoadScan: (scan: Scan) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadScan }) => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setIsLoading(true);
    const data = await getAllScans();
    setScans(data);
    setIsLoading(false);
  };

  const handleEditClick = (scan: Scan) => {
    setEditingId(scan.id);
    setEditTitle(scan.title);
  };

  const handleSaveEdit = async (scanId: string) => {
    if (!editTitle.trim()) return;

    const success = await updateScanTitle(scanId, editTitle);
    if (success) {
      setScans(scans.map(s =>
        s.id === scanId ? { ...s, title: editTitle } : s
      ));
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;

    const success = await deleteScan(scanId);
    if (success) {
      setScans(scans.filter(s => s.id !== scanId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
        </div>
        <div className="text-center py-8 text-gray-500">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <History className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
        <span className="ml-auto text-sm text-gray-500">({scans.length})</span>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No scans yet. Run a search to create your first scan.
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {scans.map((scan) => (
            <div
              key={scan.id}
              onClick={(e) => {
                if (editingId !== scan.id) {
                  console.log('Loading scan:', scan.title, scan);
                  onLoadScan(scan);
                }
              }}
              className={`border border-gray-200 rounded-lg p-4 transition-all ${
                editingId === scan.id
                  ? ''
                  : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
              }`}
            >
              {editingId === scan.id ? (
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(scan.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit(scan.id);
                    }}
                    className="p-1 text-green-600 hover:text-green-800"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm flex-1">
                    {scan.title}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(scan);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit title"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(scan.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{scan.geography || 'Global'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(scan.created_at)}</span>
                </div>
                <div className="text-gray-500">
                  {scan.signals.length} signal{scan.signals.length !== 1 ? 's' : ''} discovered
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
