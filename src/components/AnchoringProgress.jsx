import { useState } from 'react';
import { Loader2, Check, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
    { id: 'hashing', label: 'Hashing document...' },
    { id: 'signing', label: 'Requesting wallet signature...' },
    { id: 'sending', label: 'Writing proof to Algorand...' },
    { id: 'confirming', label: 'Confirming transaction...' },
];

const AnchoringProgress = ({ currentStep, txId }) => {
    // Determine step status
    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
    const isComplete = currentStep === 'complete';

    // If complete, show simplified success card instead of list
    if (isComplete) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                <div className="bg-green-100 p-2 rounded-full">
                    <ShieldCheck className="text-green-600 w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-green-800 font-semibold text-sm">Document Secured!</p>
                    <p className="text-green-600 text-[11px]">Immutable proof anchored on Algorand Blockchain.</p>
                </div>
                {txId && (
                    <div className="bg-white/60 px-2 py-1 rounded text-[10px] font-mono text-green-800 border border-green-100/50 mt-1 select-all">
                        TX: {txId}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 min-w-[280px] shadow-sm">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Anchoring Progress
            </h4>
            <div className="space-y-3">
                {STEPS.map((step, index) => {
                    const isFinished = isComplete || (currentStepIndex > index && currentStepIndex !== -1);
                    const isCurrent = currentStep === step.id;
                    const isPending = !isFinished && !isCurrent;

                    return (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className="shrink-0 relative flex items-center justify-center w-5 h-5">
                                {isFinished ? (
                                    <CheckCircle2 className="text-green-500 w-5 h-5 animate-in fade-in zoom-in duration-200" />
                                ) : isCurrent ? (
                                    <Loader2 className="text-blue-500 w-4 h-4 animate-spin" />
                                ) : (
                                    <Circle className="text-slate-300 w-4 h-4" />
                                )}
                                {isCurrent && (
                                    <span className="absolute w-full h-full rounded-full bg-blue-400/20 animate-ping"></span>
                                )}
                            </div>
                            <span className={`text-xs font-medium transition-colors duration-300 ${isFinished ? 'text-slate-500' :
                                    isCurrent ? 'text-blue-700' :
                                        'text-slate-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnchoringProgress;
