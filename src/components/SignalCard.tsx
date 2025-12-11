import React, { useState } from 'react';
import { WeakSignal } from '../types';
import { TrendingUp, AlertCircle, Percent, ExternalLink, Info } from 'lucide-react';

interface SignalCardProps {
  signal: WeakSignal;
}

const categoryColors: Record<string, string> = {
  Political: 'bg-red-100 text-red-800',
  Economic: 'bg-green-100 text-green-800',
  Social: 'bg-purple-100 text-purple-800',
  Technological: 'bg-blue-100 text-blue-800',
  Environmental: 'bg-emerald-100 text-emerald-800',
  Legal: 'bg-amber-100 text-amber-800',
};

const renderTextWithCitations = (text: string) => {
  return text;
};

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const [showMetricsExplanation, setShowMetricsExplanation] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
          {signal.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[signal.driverCategory]}`}>
          {signal.driverCategory}
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {renderTextWithCitations(signal.description)}
      </p>

      <div className="space-y-3 pt-2">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Evidence</h4>
          <p className="text-sm text-gray-600">{renderTextWithCitations(signal.evidence)}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Case Study</h4>
          <p className="text-sm text-gray-600">{renderTextWithCitations(signal.caseStudy)}</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="text-xs font-semibold text-blue-900 uppercase mb-1">World Bank Relevance</h4>
          <p className="text-sm text-blue-800">{renderTextWithCitations(signal.relevanceNote)}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Source</h4>
          {signal.sources && signal.sources.length > 0 ? (
            <a
              href={signal.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-2 text-xs text-blue-600 hover:text-blue-800 group"
            >
              <span className="flex-1 group-hover:underline">{signal.sources[0].text}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
            </a>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 italic flex-1">{signal.source}</p>
              {signal.sourceUrl && (
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase">Metrics</h4>
          {(signal.impactRationale || signal.uncertaintyRationale || signal.probabilityRationale) && (
            <button
              onClick={() => setShowMetricsExplanation(!showMetricsExplanation)}
              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
            >
              <Info className="w-3 h-3" />
              <span>{showMetricsExplanation ? 'Hide' : 'Show'} Explanation</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Impact</p>
              <p className="text-lg font-bold text-gray-900">{signal.impact}/10</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Uncertainty</p>
              <p className="text-lg font-bold text-gray-900">{signal.uncertainty}/10</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Percent className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Probability</p>
              <p className="text-lg font-bold text-gray-900">{signal.probability}/10</p>
            </div>
          </div>
        </div>

        {showMetricsExplanation && (
          <div className="mt-3 bg-gray-50 p-3 rounded-md space-y-2 text-xs">
            {signal.impactRationale && (
              <div>
                <span className="font-semibold text-orange-700">Impact: </span>
                <span className="text-gray-700">{signal.impactRationale}</span>
              </div>
            )}
            {signal.uncertaintyRationale && (
              <div>
                <span className="font-semibold text-purple-700">Uncertainty: </span>
                <span className="text-gray-700">{signal.uncertaintyRationale}</span>
              </div>
            )}
            {signal.probabilityRationale && (
              <div>
                <span className="font-semibold text-green-700">Probability: </span>
                <span className="text-gray-700">{signal.probabilityRationale}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
