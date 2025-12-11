import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { WeakSignal } from '../types';

interface ImpactMatrixProps {
  signals: WeakSignal[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-semibold text-gray-900 text-sm mb-1">{data.title}</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Impact: {data.impact}/10</p>
          <p>Uncertainty: {data.uncertainty}/10</p>
          <p>Category: {data.driverCategory}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const ImpactMatrix: React.FC<ImpactMatrixProps> = ({ signals }) => {
  const data = signals.map(signal => ({
    ...signal,
    x: signal.uncertainty,
    y: signal.impact,
  }));

  if (signals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact-Uncertainty Matrix</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No signals to display
        </div>
      </div>
    );
  }

  // Critical signals must have BOTH impact > 7 AND uncertainty > 7 (strictly greater)
  const criticalSignals = signals.filter(s => s.impact > 7 && s.uncertainty > 7);

  console.log('Critical signals analysis:', {
    total: signals.length,
    critical: criticalSignals.length,
    criticalList: criticalSignals.map(s => ({
      title: s.title,
      impact: s.impact,
      uncertainty: s.uncertainty
    }))
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Impact-Uncertainty Matrix</h2>
        {criticalSignals.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            {criticalSignals.length} Critical Watchlist
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 10]}
            tick={{ fill: '#374151', fontSize: 12 }}
          >
            <Label value="Uncertainty" offset={-20} position="insideBottom" style={{ fill: '#6b7280', fontSize: 14 }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 10]}
            tick={{ fill: '#374151', fontSize: 12 }}
          >
            <Label value="Impact" angle={-90} position="insideLeft" style={{ fill: '#6b7280', fontSize: 14 }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={7} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
          <Scatter
            data={data}
            fill="#3b82f6"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
        <p className="text-xs font-semibold text-red-900 uppercase mb-1">Critical Watchlist Zone</p>
        <p className="text-sm text-red-700">
          Signals in the upper-right quadrant (Impact &gt;7, Uncertainty &gt;7) require immediate strategic attention and scenario planning.
        </p>
      </div>
    </div>
  );
};
