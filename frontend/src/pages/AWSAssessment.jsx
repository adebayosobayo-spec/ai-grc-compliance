import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AWS_CONTROLS = [
    {
        id: 'IAM',
        name: 'Identity & Access Management',
        iso_mapping: 'A.9.2',
        description: 'Manage user access and encryption keys for AWS resources.',
        checks: [
            { id: 'mfa', label: 'MFA enabled for Root/IAM users', iso: 'A.9.4.3' },
            { id: 'least_privilege', label: 'Least-privilege policies applied', iso: 'A.9.2.1' },
            { id: 'key_rotation', label: 'Access key rotation (90 days)', iso: 'A.9.2.4' }
        ]
    },
    {
        id: 'S3',
        name: 'S3 Storage Security',
        iso_mapping: 'A.8.2',
        description: 'Ensure data in buckets is encrypted and not publicly accessible.',
        checks: [
            { id: 'public_access', label: 'Block Public Access enabled', iso: 'A.8.2.1' },
            { id: 'encryption', label: 'Default encryption (SSE-S3/KMS)', iso: 'A.18.1.5' },
            { id: 'versioning', label: 'Bucket versioning enabled', iso: 'A.17.1.2' }
        ]
    },
    {
        id: 'Network',
        name: 'Network & VPC Security',
        iso_mapping: 'A.13.1',
        description: 'Strict security groups and VPC flow logging.',
        checks: [
            { id: 'sg_audit', label: 'Security Group "0.0.0.0/0" Restricted', iso: 'A.13.1.1' },
            { id: 'flow_logs', label: 'VPC Flow Logs enabled', iso: 'A.12.4.1' },
            { id: 'waf', label: 'AWS WAF on public endpoints', iso: 'A.13.1.2' }
        ]
    }
];

export default function AWSAssessment() {
    const { orgProfile } = useAppContext();
    const [selectedTools, setSelectedTools] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleCheck = (toolId, checkId) => {
        setSelectedTools(prev => ({
            ...prev,
            [`${toolId}-${checkId}`]: !prev[`${toolId}-${checkId}`]
        }));
    };

    const runAssessment = () => {
        setLoading(true);
        setTimeout(() => {
            const passed = Object.values(selectedTools).filter(v => v).length;
            const total = AWS_CONTROLS.reduce((acc, curr) => acc + curr.checks.length, 0);
            const score = Math.round((passed / total) * 100);

            setAssessmentResult({
                score,
                passed,
                total,
                recommendations: AWS_CONTROLS.flatMap(tool =>
                    tool.checks.filter(check => !selectedTools[`${tool.id}-${check.id}`])
                        .map(check => ({
                            tool: tool.name,
                            check: check.label,
                            iso: check.iso
                        }))
                )
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full" />
                <div className="relative z-10">
                    <p className="text-xs font-mono text-primary-400 tracking-[0.3em] uppercase mb-3">Cloud Infrastructure Audit</p>
                    <h1 className="text-4xl font-black text-white leading-tight">AWS Controls <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Assessment</span></h1>
                    <p className="mt-4 text-slate-400 max-w-2xl text-lg leading-relaxed">
                        Audit your AWS environment against ISO 27001 requirements. Map cloud-native controls to information security objectives.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Selection Area */}
                <div className="space-y-6">
                    {AWS_CONTROLS.map((tool) => (
                        <div key={tool.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{tool.name}</h3>
                                    <p className="text-xs font-mono text-slate-500 mt-1">ISO Mapping: {tool.iso_mapping}</p>
                                </div>
                                <div className="bg-slate-800 p-2 rounded-lg">
                                    <span className="text-sm font-bold text-slate-300">{tool.id}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{tool.description}</p>

                            <div className="space-y-3">
                                {tool.checks.map((check) => (
                                    <label key={check.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-slate-900"
                                            checked={!!selectedTools[`${tool.id}-${check.id}`]}
                                            onChange={() => toggleCheck(tool.id, check.id)}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-200">{check.label}</p>
                                            <p className="text-[10px] font-mono text-slate-500">ISO {check.iso}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={runAssessment}
                        disabled={loading}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                        ) : (
                            <>
                                <span>Run Compliance Audit</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>

                {/* Results Area */}
                <div className="lg:sticky lg:top-8 h-fit">
                    {assessmentResult ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                            <div className="absolute top-0 right-0 text-[120px] font-black text-white/[0.02] -mr-10 -mt-10 select-none">
                                {assessmentResult.score}%
                            </div>
                            <h2 className="text-2xl font-black text-white mb-6">Audit <span className="text-primary-400">Scorecard</span></h2>

                            <div className="flex items-end gap-3 mb-8">
                                <div className="text-6xl font-black text-white">{assessmentResult.score}</div>
                                <div className="text-slate-500 font-bold mb-2">/ 100</div>
                            </div>

                            <div className="w-full bg-slate-800 rounded-full h-4 mb-8 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-600 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${assessmentResult.score}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Implemented</p>
                                    <p className="text-2xl font-bold text-emerald-400">{assessmentResult.passed}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Missing Gap</p>
                                    <p className="text-2xl font-bold text-rose-400">{assessmentResult.total - assessmentResult.passed}</p>
                                </div>
                            </div>

                            {assessmentResult.recommendations.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-mono text-primary-400 uppercase tracking-widest mb-4">Required Actions</h3>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {assessmentResult.recommendations.map((rec, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-slate-800 border-l-4 border-rose-500">
                                                <p className="text-xs font-bold text-slate-300 mb-1">{rec.tool}</p>
                                                <p className="text-sm text-white font-medium">{rec.check}</p>
                                                <p className="text-[10px] text-rose-400 font-mono mt-2">MISSING: ISO {rec.iso}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-12 text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-3xl">🧩</div>
                            <h3 className="text-xl font-bold text-white mb-2">Ready to Assess</h3>
                            <p className="text-slate-500 text-sm max-w-[240px]">
                                Select the security controls currently active in your AWS environment to generate a gap report.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
