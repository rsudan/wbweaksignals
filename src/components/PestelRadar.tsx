import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { WeakSignal, PestelCategory } from '../types';
import { TrendingUp } from 'lucide-react';

interface PestelRadarProps {
  signals: WeakSignal[];
}

export const PestelRadar: React.FC<PestelRadarProps> = ({ signals }) => {
  const categories: PestelCategory[] = ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'];
  const [selectedCategories, setSelectedCategories] = useState<Set<PestelCategory>>(new Set(categories));

  const toggleCategory = (category: PestelCategory) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const filteredSignals = signals.filter(s => selectedCategories.has(s.driverCategory));

  const data = categories.map(category => {
    const categorySignals = signals.filter(s => s.driverCategory === category);
    const count = categorySignals.length;
    const avgImpact = count > 0
      ? categorySignals.reduce((sum, s) => sum + s.impact, 0) / count
      : 0;

    return {
      category,
      count,
      impact: Number(avgImpact.toFixed(1)),
    };
  });

  const categoryColors: Record<PestelCategory, string> = {
    Political: '#ef4444',
    Economic: '#22c55e',
    Social: '#a855f7',
    Technological: '#3b82f6',
    Environmental: '#10b981',
    Legal: '#f59e0b',
  };

  if (signals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Futures Radar - PESTEL Distribution</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No signals to display
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Futures Radar - PESTEL Distribution</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(category => {
          const isSelected = selectedCategories.has(category);
          const categoryData = data.find(d => d.category === category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                  : 'bg-gray-100 text-gray-500 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {category} ({categoryData?.count || 0})
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <Radar
            name="Avg Impact"
            dataKey="impact"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>Filtered Signals ({filteredSignals.length})</span>
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredSignals.length === 0 ? (
            <p className="text-sm text-gray-500">Select categories above to view signals</p>
          ) : (
            filteredSignals.map(signal => (
              <div
                key={signal.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: categoryColors[signal.driverCategory] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{signal.title}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500">{signal.driverCategory}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-orange-600 font-medium">Impact: {signal.impact}/10</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
