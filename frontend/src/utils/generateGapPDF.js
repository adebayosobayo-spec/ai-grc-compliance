/**
 * Generates a premium gap analysis PDF report with visual illustrations.
 * Theme: Light professional — matches COMPLAI dashboard
 *
 * Visual elements:
 *  - Compliance score gauge (arc)
 *  - Risk distribution horizontal bar chart
 *  - Risk severity legend with color-coded explanations
 *  - Business impact callouts per gap (layman-friendly)
 */

// ── Dashboard-aligned palette ──────────────────────────────────────────────
const PRIMARY = [37, 99, 235]   // #2563EB blue-600
const PRIMARY_LT = [219, 234, 254]   // #DBEAFE blue-100
const DARK = [15, 23, 42]   // #0F172A slate-900
const HEADING = [30, 41, 59]   // #1E293B slate-800
const BODY_TEXT = [51, 65, 85]   // #334155 slate-700
const MUTED = [100, 116, 139]   // #64748B slate-500
const BORDER = [226, 232, 240]   // #E2E8F0 slate-200
const BG_SUBTLE = [241, 245, 249]   // #F1F5F9 slate-100
const PAGE_BG = [250, 251, 252]   // #FAFBFC
const WHITE = [255, 255, 255]

const RED = [220, 38, 38]   // red-600
const ORANGE = [234, 88, 12]   // orange-600
const YELLOW = [161, 118, 0]   // amber-700 (darker for readability)
const GREEN = [22, 163, 74]   // green-600

const RISK_COLORS = { critical: RED, high: ORANGE, medium: YELLOW, low: GREEN }
const RISK_BG = {
  critical: [254, 226, 226],
  high: [255, 237, 213],
  medium: [254, 249, 195],
  low: [220, 252, 231],
}
const RISK_LABELS = {
  critical: 'Requires immediate action — poses a serious threat to the organisation',
  high: 'Should be addressed within 30 days — significant exposure',
  medium: 'Should be planned within 90 days — moderate exposure',
  low: 'Can be scheduled for future improvement — minimal exposure',
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function setFont(doc, size, style = 'normal', color = BODY_TEXT) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style)
  doc.setTextColor(...color)
}

function drawRect(doc, x, y, w, h, fillColor) {
  doc.setFillColor(...fillColor)
  doc.rect(x, y, w, h, 'F')
}

function drawLine(doc, x1, y1, x2, y2, color = BORDER, width = 0.5) {
  doc.setDrawColor(...color)
  doc.setLineWidth(width)
  doc.line(x1, y1, x2, y2)
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function sectionTitle(doc, text, x, y) {
  setFont(doc, 10, 'bold', PRIMARY)
  doc.text(text, x, y)
  drawLine(doc, x, y + 4, x + doc.getTextWidth(text) + 8, y + 4, PRIMARY, 1.5)
  return y + 18
}

function estimateGapCardHeight(doc, gap, contentW) {
  const descLines = doc.splitTextToSize(String(gap.gap_description || ''), contentW - 24).length
  const currentLines = doc.splitTextToSize(String(gap.current_state || ''), contentW - 100).length
  const requiredLines = doc.splitTextToSize(String(gap.required_state || ''), contentW - 106).length
  const recLines = (gap.recommendations || []).reduce(
    (acc, r) => acc + doc.splitTextToSize(String(r), contentW - 44).length, 0
  )
  const impactLines = gap.business_impact
    ? doc.splitTextToSize(String(gap.business_impact), contentW - 52).length
    : 0
  return 58 + descLines * 13 + currentLines * 12 + requiredLines * 12 + recLines * 12 + (impactLines ? impactLines * 12 + 28 : 0) + 20
}

// ── Visual: Compliance Score Gauge ──────────────────────────────────────────
function drawComplianceGauge(doc, cx, cy, radius, percentage, level) {
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  const segments = 60

  // Background arc (gray)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(8)
  for (let i = 0; i < segments; i++) {
    const a1 = startAngle + (i / segments) * Math.PI
    const a2 = startAngle + ((i + 1) / segments) * Math.PI
    doc.line(
      cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)
    )
  }

  // Filled arc (colored by score)
  const fillColor = percentage >= 85 ? GREEN : percentage >= 65 ? PRIMARY : percentage >= 35 ? ORANGE : RED
  doc.setDrawColor(...fillColor)
  doc.setLineWidth(8)
  const filledSegments = Math.round((percentage / 100) * segments)
  for (let i = 0; i < filledSegments; i++) {
    const a1 = startAngle + (i / segments) * Math.PI
    const a2 = startAngle + ((i + 1) / segments) * Math.PI
    doc.line(
      cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
      cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)
    )
  }

  // Score text
  setFont(doc, 28, 'bold', DARK)
  doc.text(`${percentage}%`, cx, cy - 4, { align: 'center' })
  setFont(doc, 8, 'normal', MUTED)
  doc.text('COMPLIANCE', cx, cy + 10, { align: 'center' })
  setFont(doc, 8, 'bold', fillColor)
  doc.text(level.replace(/_/g, ' ').toUpperCase(), cx, cy + 22, { align: 'center' })
}

// ── Visual: Risk Distribution Bar Chart ─────────────────────────────────────
function drawRiskDistribution(doc, x, y, width, gaps) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  gaps.forEach(g => { counts[(g.risk_level || 'medium').toLowerCase()] = (counts[(g.risk_level || 'medium').toLowerCase()] || 0) + 1 })
  const total = gaps.length || 1

  const barHeight = 16
  const labelWidth = 60
  let by = y

    ;['critical', 'high', 'medium', 'low'].forEach(level => {
      const count = counts[level] || 0
      const pct = (count / total) * 100
      const barW = ((width - labelWidth - 40) * pct) / 100

      // Label
      setFont(doc, 8, 'bold', RISK_COLORS[level] || MUTED)
      doc.text(level.charAt(0).toUpperCase() + level.slice(1), x, by + 11)

      // Bar background
      drawRect(doc, x + labelWidth, by, width - labelWidth - 40, barHeight, BG_SUBTLE)

      // Filled bar
      if (barW > 0) {
        drawRect(doc, x + labelWidth, by, Math.max(barW, 4), barHeight, RISK_COLORS[level] || MUTED)
      }

      // Count label
      setFont(doc, 8, 'bold', DARK)
      doc.text(String(count), x + width - 32, by + 11)

      by += barHeight + 6
    })

  return by
}

// ── Main PDF Generator ─────────────────────────────────────────────────────
export function generateGapPDF(result, orgName, framework) {
  const jsPDF = window.jspdf?.jsPDF
  if (!jsPDF) {
    alert('PDF library not available. Please refresh the page and try again.')
    return
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentW = pageW - margin * 2
  let y = 0

  // ── Page background ────────────────────────────────────────────────────
  drawRect(doc, 0, 0, pageW, pageH, PAGE_BG)

  // ── Header ─────────────────────────────────────────────────────────────
  drawRect(doc, 0, 0, pageW, 100, WHITE)
  drawLine(doc, 0, 100, pageW, 100, BORDER, 1)

  // Logo
  setFont(doc, 24, 'bold', PRIMARY)
  doc.text('COMPL', margin, 44)
  const bw = doc.getTextWidth('COMPL')
  setFont(doc, 24, 'bold', DARK)
  doc.text('AI', margin + bw, 44)

  setFont(doc, 8, 'normal', MUTED)
  doc.text('COMPLIANCE INTELLIGENCE PLATFORM', margin, 60)

  // Blue accent bar
  drawRect(doc, 0, 100, pageW, 4, PRIMARY)

  // Report title row
  drawRect(doc, 0, 104, pageW, 46, BG_SUBTLE)
  drawLine(doc, 0, 150, pageW, 150, BORDER, 0.5)

  setFont(doc, 16, 'bold', DARK)
  doc.text('Gap Analysis Report', margin, 132)

  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const fwLabel = framework === 'ISO_42001' ? 'ISO/IEC 42001:2023' : 'ISO/IEC 27001:2022'
  setFont(doc, 8, 'normal', MUTED)
  doc.text(`${orgName}  ·  ${fwLabel}  ·  ${dateStr}`, pageW - margin, 132, { align: 'right' })

  y = 168

  // ── Executive Summary ──────────────────────────────────────────────────
  y = sectionTitle(doc, 'EXECUTIVE SUMMARY', margin, y)

  if (result.summary) {
    setFont(doc, 10, 'normal', BODY_TEXT)
    y = wrapText(doc, result.summary, margin, y, contentW, 14) + 10
  }

  // ── Visual: Gauge + Risk Chart side-by-side ────────────────────────────
  const gaugeSize = 65
  const gaugeCx = margin + gaugeSize + 20
  const gaugeCy = y + gaugeSize + 5

  // Gauge
  const pct = result.compliance_percentage || Math.round((result.compliant_controls / (result.total_controls || 1)) * 100)
  drawComplianceGauge(doc, gaugeCx, gaugeCy, gaugeSize, pct, result.overall_compliance_level || '')

  // Controls stat below gauge
  setFont(doc, 8, 'normal', MUTED)
  doc.text(`${result.compliant_controls} of ${result.total_controls} controls addressed`, gaugeCx, gaugeCy + 38, { align: 'center' })

  // Risk Distribution chart on the right
  const chartX = margin + gaugeSize * 2 + 70
  const chartW = contentW - gaugeSize * 2 - 70

  setFont(doc, 9, 'bold', HEADING)
  doc.text('Risk Distribution', chartX, y + 6)
  drawRiskDistribution(doc, chartX, y + 14, chartW, result.gaps || [])

  y += gaugeSize * 2 + 30

  // ── Risk Severity Legend ───────────────────────────────────────────────
  y = sectionTitle(doc, 'UNDERSTANDING RISK LEVELS', margin, y)

  drawRect(doc, margin, y - 4, contentW, 78, WHITE)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.5)
  doc.rect(margin, y - 4, contentW, 78, 'S')

  let ly = y + 6
    ;['critical', 'high', 'medium', 'low'].forEach(level => {
      // Color dot
      drawRect(doc, margin + 10, ly - 5, 8, 8, RISK_COLORS[level])
      // Level name
      setFont(doc, 8, 'bold', DARK)
      doc.text(level.charAt(0).toUpperCase() + level.slice(1), margin + 24, ly)
      // Description
      setFont(doc, 8, 'normal', BODY_TEXT)
      doc.text('— ' + RISK_LABELS[level], margin + 65, ly)
      ly += 16
    })

  y += 88

  // ── Identified Gaps ────────────────────────────────────────────────────
  if (result.gaps && result.gaps.length > 0) {
    y = sectionTitle(doc, 'IDENTIFIED GAPS', margin, y)

    result.gaps.forEach((gap, idx) => {
      const riskKey = (gap.risk_level || 'medium').toLowerCase()
      const riskColor = RISK_COLORS[riskKey] || MUTED
      const riskBg = RISK_BG[riskKey] || BG_SUBTLE

      // Page break check
      if (y > pageH - 200) {
        doc.addPage()
        drawRect(doc, 0, 0, pageW, pageH, PAGE_BG)
        drawRect(doc, 0, 0, pageW, 4, PRIMARY)
        y = 30
      }

      const cardH = estimateGapCardHeight(doc, gap, contentW)

      // Card
      drawRect(doc, margin, y, contentW, cardH, WHITE)
      drawRect(doc, margin, y, 4, cardH, riskColor)
      doc.setDrawColor(...BORDER)
      doc.setLineWidth(0.5)
      doc.rect(margin, y, contentW, cardH, 'S')

      // Gap number badge
      drawRect(doc, margin + 10, y + 8, 20, 18, PRIMARY)
      setFont(doc, 9, 'bold', WHITE)
      doc.text(String(idx + 1), margin + 20, y + 20, { align: 'center' })

      // Control ID + Name
      setFont(doc, 8, 'bold', PRIMARY)
      doc.text(gap.control_id || '', margin + 36, y + 18)
      const idW = doc.getTextWidth(gap.control_id || '') + margin + 36 + 8
      setFont(doc, 10, 'bold', DARK)
      doc.text(gap.control_name || '', idW, y + 18)

      // Risk badge
      const badgeText = riskKey.toUpperCase()
      const badgeW = doc.getTextWidth(badgeText) + 14
      drawRect(doc, pageW - margin - badgeW - 8, y + 8, badgeW, 16, riskBg)
      setFont(doc, 7, 'bold', riskColor)
      doc.text(badgeText, pageW - margin - 14, y + 18, { align: 'right' })

      // Description
      setFont(doc, 9, 'normal', BODY_TEXT)
      let iy = y + 34
      iy = wrapText(doc, gap.gap_description || '', margin + 16, iy, contentW - 24, 13)

      iy += 4
      setFont(doc, 8, 'bold', HEADING)
      doc.text('Current State:', margin + 16, iy)
      setFont(doc, 8, 'normal', BODY_TEXT)
      iy = wrapText(doc, gap.current_state || '', margin + 92, iy, contentW - 100, 12)

      setFont(doc, 8, 'bold', HEADING)
      doc.text('Required State:', margin + 16, iy)
      setFont(doc, 8, 'normal', BODY_TEXT)
      iy = wrapText(doc, gap.required_state || '', margin + 98, iy, contentW - 106, 12)

      if (gap.recommendations?.length) {
        iy += 4
        setFont(doc, 8, 'bold', HEADING)
        doc.text('Recommendations:', margin + 16, iy)
        iy += 13
        gap.recommendations.forEach((rec) => {
          setFont(doc, 8, 'normal', BODY_TEXT)
          doc.text('•', margin + 22, iy)
          iy = wrapText(doc, rec, margin + 34, iy, contentW - 44, 12)
        })
      }

      // Business Impact callout (layman-friendly)
      if (gap.business_impact) {
        iy += 6
        drawRect(doc, margin + 12, iy - 6, contentW - 24, 0, WHITE) // spacer

        // Impact callout box
        const impactLines = doc.splitTextToSize(String(gap.business_impact), contentW - 52)
        const impactH = impactLines.length * 12 + 16

        drawRect(doc, margin + 12, iy - 4, contentW - 24, impactH, [255, 247, 237]) // orange-50
        drawRect(doc, margin + 12, iy - 4, 3, impactH, ORANGE)

        setFont(doc, 7, 'bold', ORANGE)
        doc.text('⚠  WHAT THIS MEANS FOR YOUR BUSINESS', margin + 22, iy + 6)

        setFont(doc, 8, 'normal', [120, 53, 15]) // orange-900
        wrapText(doc, gap.business_impact, margin + 22, iy + 18, contentW - 52, 12)
      }

      y += cardH + 10
    })
  } else {
    drawRect(doc, margin, y, contentW, 42, WHITE)
    doc.setDrawColor(...BORDER)
    doc.rect(margin, y, contentW, 42, 'S')
    setFont(doc, 9, 'normal', MUTED)
    doc.text('No critical gaps identified for the controls evaluated.', margin + 14, y + 26)
    y += 56
  }

  // ── Next Steps ─────────────────────────────────────────────────────────
  if (result.next_steps?.length) {
    if (y > pageH - 140) {
      doc.addPage()
      drawRect(doc, 0, 0, pageW, pageH, PAGE_BG)
      drawRect(doc, 0, 0, pageW, 4, PRIMARY)
      y = 30
    }
    y = sectionTitle(doc, 'RECOMMENDED NEXT STEPS', margin, y)

    result.next_steps.forEach((step, i) => {
      drawRect(doc, margin, y - 10, 22, 22, PRIMARY)
      setFont(doc, 9, 'bold', WHITE)
      doc.text(String(i + 1), margin + 11, y + 4, { align: 'center' })

      setFont(doc, 9, 'normal', BODY_TEXT)
      y = wrapText(doc, step, margin + 30, y, contentW - 34, 13)
      y += 6
    })
  }

  // ── Footer (all pages) ─────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawLine(doc, margin, pageH - 32, pageW - margin, pageH - 32, BORDER, 0.5)
    setFont(doc, 7, 'normal', MUTED)
    doc.text('COMPLAI — Compliance Intelligence Platform', margin, pageH - 18)
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 18, { align: 'right' })
    setFont(doc, 7, 'normal', BORDER)
    doc.text(`CONFIDENTIAL — ${orgName}`, pageW / 2, pageH - 18, { align: 'center' })
  }

  const fileName = `GapAnalysis_${orgName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(fileName)
}
