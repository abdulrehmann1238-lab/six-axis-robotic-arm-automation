import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { Layers, Play, Pause, XCircle, Plus, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { INGREDIENTS_CATALOG } from '../../state/simulationEngine';
import { ProductionOrder } from '../../types';

export const MenuOSSection: React.FC = () => {
  const { 
    currentOrder, 
    menuOSStatus, 
    isRunning, 
    isPaused, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation, 
    addLog,
    logs
  } = useSimulation();

  const [orderId, setOrderId] = useState(currentOrder.orderId);
  const [recipeItems, setRecipeItems] = useState([
    { ingredient: 'Tomato Sauce', grams: 50 },
    { ingredient: 'Cheese', grams: 30 },
    { ingredient: 'Olive Oil', grams: 10 },
    { ingredient: 'Herb Mix', grams: 5 },
    { ingredient: 'Seasoning', grams: 2 }
  ]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const workflowSteps = [
    '1. MenuOS receives order',
    '2. Recipe is validated',
    '3. Ingredient requirements generated',
    '4. Robotic operations scheduled',
    '5. DS receives dispensing instructions',
    '6. Robotic & DS operations coordinated',
    '7. Status acknowledgments received',
    '8. Order is marked complete'
  ];

  const handleQuantityChange = (ingredientName: string, newGrams: number) => {
    setRecipeItems(prev => prev.map(item => 
      item.ingredient === ingredientName ? { ...item, grams: Math.max(1, newGrams) } : item
    ));
    addLog('MenuOS', 'RECIPE_MODIFIED', `Adjusted ${ingredientName} target to ${newGrams}g.`, 'info');
  };

  const handleGenerateNewOrder = () => {
    const nextId = `MNU-${Math.floor(2050 + Math.random() * 800)}`;
    setOrderId(nextId);
    resetSimulation();
    addLog('MenuOS', 'ORDER_CREATED', `Created new production ticket ${nextId}.`, 'info');
  };

  const menuOSLogs = logs.filter(l => l.source === 'MenuOS').slice(0, 5);

  return (
    <section id="menuos-preview" className="py-20 sm:py-24 bg-industrial-bg border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            07 // CENTRALIZED ORCHESTRATION (MENUOS)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Orchestration begins with the order.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            MenuOS serves as the authoritative orchestrator: validating digital customer tickets, compiling bill-of-materials, sequencing multi-axis robotic trajectories, and enforcing atomic dispensing authorizations.
          </p>
        </div>

        {/* Order Management Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Order Manifest & Quantity Adjuster */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-6">
              {/* Order Manifest Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-border gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-industrial-accent/15 text-industrial-accent text-xs font-mono font-bold">
                      ORDER TICKET: {orderId}
                    </span>
                    <span className="text-xs font-mono text-industrial-textMuted">
                      STATUS: <strong className="text-industrial-accent">{menuOSStatus}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-industrial-text mt-1">
                    Automated Preparation — Sample Recipe
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateNewOrder}
                    className="px-3 py-1.5 rounded-lg border border-industrial-border bg-industrial-bgSecondary hover:bg-industrial-border text-xs font-mono font-semibold text-industrial-text flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Order</span>
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-industrial-border bg-industrial-bgSecondary hover:bg-industrial-border text-xs font-mono font-semibold text-industrial-text flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Order History</span>
                  </button>
                </div>
              </div>

              {/* Ingredient Line Items with Interactive Gram Inputs */}
              <div className="space-y-3 font-mono text-xs">
                <div className="text-[11px] font-bold text-industrial-textMuted uppercase flex justify-between">
                  <span>Ingredient Specification</span>
                  <span>Target Mass</span>
                </div>

                {recipeItems.map((item) => (
                  <div
                    key={item.ingredient}
                    className="p-3 rounded-xl bg-industrial-bgSecondary/50 border border-industrial-border flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-industrial-text">{item.ingredient}</div>
                      <div className="text-[10px] text-industrial-textMuted">
                        Density: {INGREDIENTS_CATALOG[item.ingredient as keyof typeof INGREDIENTS_CATALOG]?.density || '1.0 g/ml'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="150"
                        value={item.grams}
                        onChange={(e) => handleQuantityChange(item.ingredient, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-right font-bold text-industrial-accent bg-white border border-industrial-border rounded-lg focus:outline-none focus:ring-1 focus:ring-industrial-accent"
                      />
                      <span className="text-industrial-text font-semibold">g</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Execution Controls Row */}
              <div className="pt-4 border-t border-industrial-border flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-industrial-textMuted">
                  Total Payload: <strong className="text-industrial-text">{recipeItems.reduce((acc, i) => acc + i.grams, 0)} grams</strong>
                </div>

                <div className="flex items-center gap-2">
                  {!isRunning && !isPaused ? (
                    <button
                      onClick={startSimulation}
                      className="px-5 py-2.5 rounded-xl bg-industrial-accent text-white font-semibold text-xs font-mono flex items-center gap-2 hover:bg-industrial-accent/90 transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Execution</span>
                    </button>
                  ) : isPaused ? (
                    <button
                      onClick={startSimulation}
                      className="px-5 py-2.5 rounded-xl bg-industrial-accent text-white font-semibold text-xs font-mono flex items-center gap-2 hover:bg-industrial-accent/90 transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseSimulation}
                      className="px-5 py-2.5 rounded-xl bg-industrial-warning text-white font-semibold text-xs font-mono flex items-center gap-2 hover:bg-industrial-warning/90 transition-all shadow-sm"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Execution</span>
                    </button>
                  )}

                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2.5 rounded-xl border border-industrial-border bg-industrial-bgSecondary hover:bg-industrial-border text-industrial-text text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-industrial-fault" />
                    <span>Cancel / Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Steps & Real-Time Orchestration Event Feed */}
          <div className="lg:col-span-5 space-y-6">
            {/* 8 Workflow Lifecycle Stages (PRD Section 11) */}
            <div className="p-6 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-industrial-accent" />
                  <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                    MenuOS Coordination Pipeline
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-industrial-accent font-semibold">
                  8-Stage Synchronizer
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {workflowSteps.map((step, idx) => {
                  const isCurrent = isRunning && menuOSStatus !== 'READY';
                  return (
                    <div
                      key={step}
                      className="p-2.5 rounded-lg bg-industrial-bgSecondary/60 border border-industrial-border flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-industrial-accent flex-shrink-0" />
                      <span className="text-industrial-text font-medium">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MenuOS Outbound Event Stream */}
            <div className="p-4 rounded-xl bg-industrial-dark text-gray-200 border border-[#39493f] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#39493f] text-[11px] text-gray-400">
                <span>MenuOS Event Stream</span>
                <span className="text-industrial-accentLight">REST / WebSocket</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {menuOSLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 whitespace-nowrap">{log.timestamp}</span>
                    <span className="font-bold text-industrial-accentLight whitespace-nowrap">{log.eventType}</span>
                    <span className="truncate">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#202923] text-industrial-text dark:text-gray-100 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-industrial-border dark:border-[#38483d] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <h3 className="font-heading font-bold text-base">MenuOS Order Audit History</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-xs font-mono font-bold hover:underline">
                Close ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              {[
                { id: 'MNU-2046', recipe: 'Artisan Blend #1', time: '10:35:12', mass: '92g', status: 'COMPLETED' },
                { id: 'MNU-2047', recipe: 'Herb Infusion Base', time: '10:38:45', mass: '85g', status: 'COMPLETED' },
                { id: 'MNU-2048', recipe: 'Precision Artisan Blend', time: '10:42:01', mass: '97g', status: 'IN_QUEUE' }
              ].map(hist => (
                <div key={hist.id} className="p-3 rounded-lg bg-industrial-bgSecondary/60 dark:bg-white/5 border border-industrial-border flex items-center justify-between">
                  <div>
                    <div className="font-bold text-industrial-accent">{hist.id}</div>
                    <div className="text-[10px] text-industrial-textMuted">{hist.recipe} • {hist.mass}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-industrial-success/15 text-industrial-success">
                      {hist.status}
                    </span>
                    <div className="text-[10px] text-industrial-textMuted mt-0.5">{hist.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

