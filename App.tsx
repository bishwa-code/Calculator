import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorButton } from './components/CalculatorButton';
import { Display } from './components/Display';
import { evaluateExpression } from './utils/mathUtils';
import { ButtonVariant, CalculationHistory } from './types';
import { History, RotateCcw, Delete, Equal, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_INPUT_LENGTH = 30;

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastWasEquals, setLastWasEquals] = useState(false);

  const handleClear = () => {
    setExpression('');
    setResult('');
    setLastWasEquals(false);
  };

  const handleDelete = () => {
    if (lastWasEquals) {
      handleClear();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleInput = useCallback((val: string) => {
    if (expression.length > MAX_INPUT_LENGTH) return;
    
    // If user starts typing after a calculation, decide whether to append or start new
    if (lastWasEquals) {
      if (['+', '-', '*', '/', '^2', '^3'].includes(val)) {
        // If operator, continue with previous result
        setExpression(result + val);
      } else if (val.startsWith('√') || val.startsWith('∛')) {
        // If function, start new with function
        setExpression(val);
      } else {
        // If number, start completely new
        setExpression(val);
      }
      setLastWasEquals(false);
    } else {
      setExpression((prev) => prev + val);
    }
  }, [expression, lastWasEquals, result]);

  const handleCalculate = () => {
    if (!expression) return;
    
    const res = evaluateExpression(expression);
    setResult(res);
    setLastWasEquals(true);

    if (res !== "Error") {
      setHistory(prev => [
        {
          id: Date.now().toString(),
          expression: expression,
          result: res,
          timestamp: Date.now()
        },
        ...prev
      ].slice(0, 50)); // Keep last 50
    }
  };

  const restoreHistory = (item: CalculationHistory) => {
    setExpression(item.result); // Or item.expression if preferred to edit
    setResult('');
    setLastWasEquals(false);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/\d/.test(key)) handleInput(key);
      if (['+', '-', '*', '/', '(', ')', '.'].includes(key)) handleInput(key);
      if (key === 'Enter') { e.preventDefault(); handleCalculate(); }
      if (key === 'Backspace') handleDelete();
      if (key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, expression]); // Dependencies for closure freshness

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative w-full max-w-sm sm:max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col p-6 z-10">
        
        {/* Header / History Toggle */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-amber-500/80" />
             <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-full transition-colors ${showHistory ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}
          >
            <History size={20} />
          </motion.button>
        </div>

        {/* Display */}
        <Display expression={expression} result={result} />

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          
          {/* Row 1: Scientific + Clear */}
          <CalculatorButton 
            label="AC" 
            value="AC" 
            onClick={handleClear} 
            variant={ButtonVariant.DANGER} 
            className="text-lg font-bold"
          />
          <CalculatorButton 
            label={<Delete size={20} />} 
            value="DEL" 
            onClick={handleDelete} 
            variant={ButtonVariant.ACCENT}
          />
          <CalculatorButton label="√" value="√(" onClick={handleInput} variant={ButtonVariant.ACCENT} />
          <CalculatorButton label="÷" value="/" onClick={handleInput} variant={ButtonVariant.ACCENT} className="bg-zinc-800 text-indigo-400" />

          {/* Row 2 */}
          <CalculatorButton label="x²" value="^2" onClick={handleInput} variant={ButtonVariant.ACCENT} />
          <CalculatorButton label="x³" value="^3" onClick={handleInput} variant={ButtonVariant.ACCENT} />
          <CalculatorButton label="∛" value="∛(" onClick={handleInput} variant={ButtonVariant.ACCENT} />
          <CalculatorButton label="×" value="*" onClick={handleInput} variant={ButtonVariant.ACCENT} className="bg-zinc-800 text-indigo-400" />

          {/* Row 3 */}
          <CalculatorButton label="7" value="7" onClick={handleInput} />
          <CalculatorButton label="8" value="8" onClick={handleInput} />
          <CalculatorButton label="9" value="9" onClick={handleInput} />
          <CalculatorButton label="−" value="-" onClick={handleInput} variant={ButtonVariant.ACCENT} className="bg-zinc-800 text-indigo-400" />

          {/* Row 4 */}
          <CalculatorButton label="4" value="4" onClick={handleInput} />
          <CalculatorButton label="5" value="5" onClick={handleInput} />
          <CalculatorButton label="6" value="6" onClick={handleInput} />
          <CalculatorButton label="+" value="+" onClick={handleInput} variant={ButtonVariant.ACCENT} className="bg-zinc-800 text-indigo-400" />

          {/* Row 5 */}
          <CalculatorButton label="1" value="1" onClick={handleInput} />
          <CalculatorButton label="2" value="2" onClick={handleInput} />
          <CalculatorButton label="3" value="3" onClick={handleInput} />
          <CalculatorButton 
            label={<Equal size={28} />} 
            value="=" 
            onClick={handleCalculate} 
            variant={ButtonVariant.ACTION} 
            className="row-span-2 h-full rounded-2xl"
          />

          {/* Row 6 */}
          <CalculatorButton label="0" value="0" onClick={handleInput} doubleWidth className="rounded-2xl" />
          <CalculatorButton label="." value="." onClick={handleInput} />
          {/* Equals takes up the last slot via row-span */}
        </div>
      </main>

      {/* History Drawer/Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-zinc-900 border-l border-zinc-800 z-30 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <RotateCcw size={20} /> History
                </h2>
                <button 
                  onClick={clearHistory}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {history.length === 0 ? (
                  <div className="text-center text-zinc-600 mt-10">
                    No calculations yet
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.button
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => restoreHistory(item)}
                      className="w-full text-right p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all group"
                    >
                      <div className="text-zinc-400 text-sm mb-1 font-mono">{item.expression}</div>
                      <div className="text-white text-xl font-bold group-hover:text-indigo-400 transition-colors">
                        = {item.result}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}