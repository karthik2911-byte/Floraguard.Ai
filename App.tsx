import React, { useState } from 'react';
import { ImageInput } from './components/ImageInput';
import { AnalysisView } from './components/AnalysisView';
import { analyzePlantImage } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';
import { Sprout, RefreshCw, AlertCircle, Camera } from 'lucide-react';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    result: null,
    error: null,
    imageUri: null,
  });

  const handleImageSelected = async (base64: string) => {
    setState({ status: 'analyzing', result: null, error: null, imageUri: base64 });
    
    try {
      const result = await analyzePlantImage(base64);
      setState({ status: 'complete', result, error: null, imageUri: base64 });
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: "Failed to analyze image. Please try again or use a clearer photo." 
      }));
    }
  };

  const handleReset = () => {
    setState({ status: 'idle', result: null, error: null, imageUri: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-800">
      
      {/* App Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Sprout size={20} className="text-emerald-600" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">FloraGuard AI</h1>
          </div>
          {state.status === 'complete' && (
            <button 
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col">
        
        {state.status === 'idle' && (
          <div className="flex-1 flex flex-col justify-center items-center animate-fade-in-up">
            <div className="text-center mb-10 max-w-sm mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                Is your plant healthy?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Instant disease detection with AI-powered heatmap diagnostics and severity tracking.
              </p>
            </div>
            <ImageInput onImageSelected={handleImageSelected} />
          </div>
        )}

        {state.status === 'analyzing' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-pulse">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <Sprout className="absolute inset-0 m-auto text-emerald-500 animate-bounce" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Leaf Structure...</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Identifying potential pathogens and generating severity heatmap.
            </p>
          </div>
        )}

        {state.status === 'complete' && state.result && state.imageUri && (
          <AnalysisView 
            result={state.result} 
            imageUri={state.imageUri} 
            onReset={handleReset}
          />
        )}

        {state.status === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h3>
            <p className="text-gray-600 mb-8 max-w-xs mx-auto">{state.error}</p>
            <Button onClick={handleReset}>Try Again</Button>
          </div>
        )}

      </main>

      {/* Floating Action Button for New Scan (Mobile Only, when viewing results) */}
      {state.status === 'complete' && (
        <div className="fixed bottom-6 left-0 right-0 p-4 flex justify-center z-40 md:hidden">
          <Button 
            onClick={handleReset} 
            className="shadow-2xl shadow-emerald-500/40 rounded-full px-8 py-4 text-base"
            icon={<Camera size={20} />}
          >
            New Plant Scan
          </Button>
        </div>
      )}
      
      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-xs border-t border-emerald-100/50 mt-auto">
        <p>© 2024 FloraGuard AI. Powered by Gemini 2.5 Flash.</p>
      </footer>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;