import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Key, FileCode, RotateCcw, Eye, EyeOff } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetPrompts } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(settings.apiKey);
  const [localSystemPrompt, setLocalSystemPrompt] = useState(settings.systemPrompt);
  const [localPestelPrompt, setLocalPestelPrompt] = useState(settings.pestelPrompt);
  const [localSignalDefinition, setLocalSignalDefinition] = useState(settings.signalDefinition);
  const [localSourceDiversity, setLocalSourceDiversity] = useState(settings.sourceDiversity);
  const [localMetricsMethodology, setLocalMetricsMethodology] = useState(settings.metricsMethodology);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      apiKey: localApiKey,
      systemPrompt: localSystemPrompt,
      pestelPrompt: localPestelPrompt,
      signalDefinition: localSignalDefinition,
      sourceDiversity: localSourceDiversity,
      metricsMethodology: localMetricsMethodology,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetPrompts();
    setLocalSystemPrompt(settings.systemPrompt);
    setLocalPestelPrompt(settings.pestelPrompt);
    setLocalSignalDefinition(settings.signalDefinition);
    setLocalSourceDiversity(settings.sourceDiversity);
    setLocalMetricsMethodology(settings.metricsMethodology);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Perplexity API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="pplx-..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {localApiKey ? 'API key configured. Leave blank to use simulation mode.' : 'No API key set. Simulation mode will be used.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Prompt Management</h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              value={localSystemPrompt}
              onChange={(e) => setLocalSystemPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-none"
            />
          </div>

          <div>
            <label htmlFor="pestelPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              PESTEL Analysis Instructions
            </label>
            <textarea
              id="pestelPrompt"
              value={localPestelPrompt}
              onChange={(e) => setLocalPestelPrompt(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-none"
            />
          </div>

          <div>
            <label htmlFor="signalDefinition" className="block text-sm font-medium text-gray-700 mb-1">
              Signal Definition & Structure
            </label>
            <textarea
              id="signalDefinition"
              value={localSignalDefinition}
              onChange={(e) => setLocalSignalDefinition(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-none"
            />
          </div>

          <div>
            <label htmlFor="sourceDiversity" className="block text-sm font-medium text-gray-700 mb-1">
              Source Diversity Requirements
            </label>
            <textarea
              id="sourceDiversity"
              value={localSourceDiversity}
              onChange={(e) => setLocalSourceDiversity(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-none"
            />
          </div>

          <div>
            <label htmlFor="metricsMethodology" className="block text-sm font-medium text-gray-700 mb-1">
              Metrics Computation Methodology
            </label>
            <textarea
              id="metricsMethodology"
              value={localMetricsMethodology}
              onChange={(e) => setLocalMetricsMethodology(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs resize-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        {saved ? 'Settings Saved!' : 'Save Settings'}
      </button>
    </div>
  );
};
