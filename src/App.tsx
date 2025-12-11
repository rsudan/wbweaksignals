import React, { useState } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { useSettings } from './contexts/SettingsContext';
import { SearchForm } from './components/SearchForm';
import { SignalCard } from './components/SignalCard';
import { PestelRadar } from './components/PestelRadar';
import { ImpactMatrix } from './components/ImpactMatrix';
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { SearchParams, WeakSignal, Scan } from './types';
import { searchWithPerplexity } from './services/perplexityService';
import { generateMockSignals } from './services/mockDataEngine';
import { saveScan } from './services/scanHistoryService';
import { Radar, Settings, AlertTriangle, History } from 'lucide-react';

type ViewType = 'scanner' | 'history' | 'settings';

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const [currentView, setCurrentView] = useState<ViewType>('scanner');
  const [signals, setSignals] = useState<WeakSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedScanTitle, setLoadedScanTitle] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setLoadedScanTitle(null);

    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);

    try {
      let results: WeakSignal[];

      if (settings.apiKey) {
        try {
          results = await searchWithPerplexity(
            params,
            settings.apiKey,
            settings.systemPrompt,
            settings.pestelPrompt,
            settings.signalDefinition,
            settings.sourceDiversity,
            settings.metricsMethodology
          );
        } catch (apiError) {
          console.error('API error, falling back to simulation:', apiError);
          setError('API request failed. Using simulation mode.');
          results = generateMockSignals(params);
        }
      } else {
        results = generateMockSignals(params);
      }

      setSignals(results);

      await saveScan(params, results);

      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError('An error occurred while scanning for signals.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadScan = (scan: Scan) => {
    console.log('handleLoadScan called with:', scan);
    console.log('Number of signals:', scan.signals?.length);

    setSignals(scan.signals);
    setCurrentView('scanner');
    setLoadedScanTitle(scan.title);

    // Scroll to results section after loading
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Radar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Horizon Scanner</h1>
              <p className="text-xs text-gray-500">World Bank</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('scanner')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
              currentView === 'scanner'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Radar className="w-5 h-5" />
            <span>Signal Scanner</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
              currentView === 'history'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            <span>Scan History</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-xs text-blue-900 font-medium mb-1">Mode</p>
            <p className="text-xs text-blue-700">
              {settings.apiKey ? 'Live API' : 'Simulation'}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {currentView === 'scanner' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Weak Signal Horizon Scanner</h2>
                  <p className="text-gray-600">
                    Discover early indicators of emerging trends, disruptions, and changes that could impact development policies and operations.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('settings')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </button>
              </div>

              <SearchForm onSearch={handleSearch} isLoading={isLoading} />

              <div id="results-section">
                {isLoading && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        <Radar className="w-6 h-6 text-blue-600 animate-spin" />
                        <h3 className="text-lg font-medium text-gray-900">Scanning horizon for weak signals...</h3>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {settings.apiKey ? 'Querying live sources via Perplexity AI...' : 'Generating simulation data...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-900">Notice</h3>
                    <p className="text-sm text-yellow-800 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {loadedScanTitle && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                  <History className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Loaded from History</h3>
                    <p className="text-sm text-blue-800 mt-1">{loadedScanTitle}</p>
                  </div>
                </div>
              )}

              {!isLoading && signals.length > 0 && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PestelRadar signals={signals} />
                    <ImpactMatrix signals={signals} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Discovered Signals ({signals.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {signals.map((signal) => (
                        <SignalCard key={signal.id} signal={signal} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentView === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Scan History</h2>
                <p className="text-gray-600">
                  Review and reload previous signal scans.
                </p>
              </div>

              <HistoryPanel onLoadScan={handleLoadScan} />
            </div>
          )}

          {currentView === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">
                  Configure API access and customize the prompt engineering for signal detection.
                </p>
              </div>

              <SettingsPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
