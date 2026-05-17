import { supabase } from './supabase'

/* ── Save assessment result for a logged-in user ──────────────── */
export async function saveAssessment({ userId, company, answers, results }) {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id:       userId,
      company_name:  company.companyName  || null,
      company_email: company.email        || null,
      company_size:  company.companySize  || null,
      industry:      company.industry     || null,
      num_ai_systems: company.numAISystems || null,
      overall_score: results.overallScore,
      section_scores: results.sectionScores,
      top_gaps:      results.topGaps,
      answers,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

/* ── Load the most recent assessment for a user ───────────────── */
export async function getLatestAssessment(userId) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // no rows
    throw error
  }
  return data
}

/* ── List all assessments for a user ──────────────────────────── */
export async function listAssessments(userId) {
  const { data, error } = await supabase
    .from('assessments')
    .select('id, company_name, overall_score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/* ── Save payment record ──────────────────────────────────────── */
export async function savePayment({ userId, assessmentId, amount = 299 }) {
  const { error } = await supabase
    .from('payments')
    .insert({ user_id: userId, assessment_id: assessmentId, amount, status: 'paid' })

  if (error) throw error
}

/* ── Check if user has paid ───────────────────────────────────── */
export async function hasPaid(userId) {
  const { data, error } = await supabase
    .from('payments')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .limit(1)

  if (error) return false
  return data.length > 0
}
