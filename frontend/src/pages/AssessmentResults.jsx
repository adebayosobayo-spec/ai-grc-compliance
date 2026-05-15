import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts'
import { 
  CheckCircle, AlertTriangle, Lock, Download, 
  ArrowRight, ShieldCheck, FileText, Zap 
} from 'lucide-react'
import { ASSESSMENT_SECTIONS } from '../utils/assessmentData'

export default function AssessmentResults() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        setData(data)
      } catch (err) {
        console.error('Error fetching results:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h1 className="text-2xl font-black mb-2 font-heading">Assessment Not Found</h1>
        <p className="text-slate-400 mb-6">We couldn't find the results for this assessment ID.</p>
        <Link to="/assessment" className="btn-primary">Take New Assessment</Link>
      </div>
    )
  }

  const chartData = [
    { name: 'Completed', value: data.readiness_score },
    { name: 'Remaining', value: 100 - data.readiness_score },
  ]

  const barData = ASSESSMENT_SECTIONS.map(s => ({
    name: s.id,
    score: data.control_scores[s.id] || 0,
    full_name: s.title
  }))

  const COLORS = ['#F59E0B', '#1E293B']

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">
              Audit Result: ISO 42001
            </div>
            <h1 className="text-4xl font-black text-white font-heading uppercase tracking-tight">
              Readiness Report: <span className="text-amber-500">{data.company_info.company_name}</span>
            </h1>
            <p className="text-slate-400 mt-2">Assessment completed on {new Date(data.created_at).toLocaleDateString()}</p>
          </div>
          <button className="btn-secondary text-sm">
            <Download size={16} /> Download Summary PDF
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Readiness Score Card */}
          <div className="lg:col-span-1 card-dark p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Overall Readiness Score</h3>
            <div className="relative w-48 h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white font-heading">{data.readiness_score}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ready</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based on your answers, you are {data.readiness_score >= 80 ? 'highly' : data.readiness_score >= 50 ? 'moderately' : 'minimally'} aligned with ISO 42001 requirements.
            </p>
          </div>

          {/* Section Breakdown Card */}
          <div className="lg:col-span-2 card-dark p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Section Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#F59E0B', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-8">
              {barData.map(d => (
                <div key={d.name} className="text-center">
                  <div className="text-[10px] font-black text-white">{d.score}%</div>
                  <div className="text-[8px] font-black text-slate-600 uppercase">{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Banner: Unlock Policies */}
        <div className="mt-12 p-1 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 rounded-[2.5rem] shadow-2xl shadow-amber-500/20">
          <div className="bg-slate-900 rounded-[2.4rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -z-10" />
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest mb-4">
                <Zap size={14} /> Bridge the Gaps
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-heading tracking-tight leading-tight">
                Instantly fix your compliance gaps for <span className="text-amber-500">$299</span>.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Don't wait for an audit failure. Generate 7 customized, audit-ready ISO 42001 policies specifically tailored for <strong>{data.company_info.company_name}</strong>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/checkout" className="btn-primary px-8">
                  Generate All Policies <ArrowRight size={18} />
                </Link>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> SECURE</span>
                  <span className="flex items-center gap-1"><Zap size={14} className="text-emerald-500" /> INSTANT</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              {[
                { title: 'AI Ethics Policy', icon: ShieldCheck },
                { title: 'Data Governance', icon: FileText },
                { title: 'Incident Response', icon: AlertTriangle },
                { title: 'Risk Assessment', icon: Zap },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
                  <item.icon className="text-amber-500" size={20} />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{item.title}</span>
                  <Lock size={12} className="text-slate-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Gap Breakdown */}
        <div className="mt-20">
          <h3 className="text-2xl font-black text-white mb-10 font-heading uppercase tracking-tight">Prioritized Action Items</h3>
          <div className="space-y-6">
            {ASSESSMENT_SECTIONS.map(section => {
              const score = data.control_scores[section.id]
              if (score >= 100) return null
              return (
                <div key={section.id} className="card-dark p-8 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
                        score < 50 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {section.id}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white font-heading">{section.title}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Status: {score}% Aligned</p>
                      </div>
                    </div>
                    <span className={`badge ${score < 50 ? 'badge-error' : 'badge-warning'}`}>
                      {score < 50 ? 'Critical Gap' : 'Partial Gap'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-2xl">
                    Your {section.title.toLowerCase()} process is incomplete. To reach 100% readiness, you need a formal {section.title.split(' ')[0]} framework and documented controls.
                  </p>
                  <Link to="/checkout" className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest cursor-pointer group-hover:translate-x-1 transition-transform">
                    Unlock Policy Fix <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
