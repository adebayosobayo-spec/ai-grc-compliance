/**
 * Generates a formatted PDF report from a gap analysis result.
 * Uses jsPDF loaded from CDN (window.jspdf.jsPDF) — no npm install needed.
 */

const LIME = [191, 255, 0]
const BLACK = [10, 10, 15]
const DARK_CARD = [26, 26, 26]
const GRAY_TEXT = [156, 163, 175]
const WHITE = [255, 255, 255]
const RED = [248, 113, 113]
const ORANGE = [251, 146, 60]
const YELLOW = [250, 204, 21]
const GREEN = [74, 222, 128]

const RISK_COLORS = { critical: RED, high: ORANGE, medium: YELLOW, low: GREEN }

function setFont(doc, size, style = 'normal', color = WHITE) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style)
  doc.setTextColor(...color)
}

function drawRect(doc, x, y, w, h, fillColor) {
  doc.setFillColor(...fillColor)
  doc.rect(x, y, w, h, 'F')
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function estimateGapCardHeight(doc, gap, contentW) {
  const descLines = doc.splitTextToSize(String(gap.gap_description || ''), contentW - 20).length
  const currentLines = doc.splitTextToSize(String(gap.current_state || ''), contentW - 96).length
  const requiredLines = doc.splitTextToSize(String(gap.required_state || ''), contentW - 102).length
  const recLines = (gap.recommendations || []).reduce(
    (acc, r) => acc + doc.splitTextToSize(String(r), contentW - 40).length, 0
  )
  return 60 + descLines * 13 + currentLines * 12 + requiredLines * 12 + recLines * 12 + 20
}

export function generateGapPDF(result, orgName, framework) {
  // Get jsPDF from CDN global (window.jspdf set by the script tag in index.html)
  const jsPDF = window.jspdf?.jsPDF
  if (!jsPDF) {
    alert('PDF library not available. Please refresh the page and try again.')
    return
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 40
  const contentW = pageW - margin * 2
  let y = 0

  // ── Header ────────────────────────────────────────────────────────────────
  drawRect(doc, 0, 0, pageW, 120, BLACK)
  drawRect(doc, 0, 118, pageW, 3, LIME)

  setFont(doc, 22, 'bold', LIME)
  doc.text('COMPL', margin, 52)
  const bw = doc.getTextWidth('COMPL')
  setFont(doc, 22, 'bold', WHITE)
  doc.text('AI', margin + bw, 52)

  setFont(doc, 8, 'normal', GRAY_TEXT)
  doc.text('COMPLIANCE INTELLIGENCE PLATFORM', margin, 68)

  setFont(doc, 18, 'bold', WHITE)
  doc.text('Gap Analysis Report', margin, 100)

  setFont(doc, 8, 'normal', GRAY_TEXT)
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const fwLabel = framework === 'ISO_42001' ? 'ISO/IEC 42001:2023' : 'ISO/IEC 27001:2022'
  doc.text(`${orgName}  \u00B7  ${fwLabel}  \u00B7  ${dateStr}`, pageW - margin, 100, { align: 'right' })

  y = 140

  // ── Executive Summary ─────────────────────────────────────────────────────
  setFont(doc, 9, 'normal', LIME)
  doc.text('EXECUTIVE SUMMARY', margin, y)
  y += 16

  if (result.summary) {
    setFont(doc, 10, 'normal', GRAY_TEXT)
    y = wrapText(doc, result.summary, margin, y, contentW, 14) + 8
  }

  // ── Stat Cards ────────────────────────────────────────────────────────────
  const cardW = (contentW - 16) / 3
  const cards = [
    { label: 'COMPLIANCE LEVEL', value: (result.overall_compliance_level || '').replace(/_/g, ' '), color: LIME },
    { label: 'COMPLIANT CONTROLS', value: `${result.compliant_controls} / ${result.total_controls}`, color: LIME },
    { label: 'GAPS IDENTIFIED', value: String(result.gaps?.length ?? 0), color: result.gaps?.length ? RED : GREEN },
  ]

  cards.forEach((card, i) => {
    const cx = margin + i * (cardW + 8)
    drawRect(doc, cx, y, cardW, 56, DARK_CARD)
    drawRect(doc, cx, y, cardW, 2, LIME)
    setFont(doc, 7, 'normal', GRAY_TEXT)
    doc.text(card.label, cx + 10, y + 16)
    setFont(doc, 14, 'bold', card.color)
    doc.text(card.value.toUpperCase(), cx + 10, y + 40)
  })

  y += 72

  // ── Identified Gaps ───────────────────────────────────────────────────────
  if (result.gaps && result.gaps.length > 0) {
    setFont(doc, 9, 'normal', LIME)
    doc.text('IDENTIFIED GAPS', margin, y)
    y += 16

    result.gaps.forEach((gap) => {
      const riskColor = RISK_COLORS[gap.risk_level?.toLowerCase()] || GRAY_TEXT

      if (y > pageH - 180) {
        doc.addPage()
        drawRect(doc, 0, 0, pageW, 4, LIME)
        y = 30
      }

      const cardH = estimateGapCardHeight(doc, gap, contentW)
      drawRect(doc, margin, y, contentW, cardH, DARK_CARD)
      drawRect(doc, margin, y, 4, cardH, riskColor)

      setFont(doc, 8, 'bold', LIME)
      doc.text(gap.control_id || '', margin + 14, y + 16)
      const idW = doc.getTextWidth(gap.control_id || '') + margin + 14 + 6
      setFont(doc, 10, 'bold', WHITE)
      doc.text(gap.control_name || '', idW, y + 16)

      setFont(doc, 7, 'bold', riskColor)
      doc.text((gap.risk_level || 'medium').toUpperCase(), pageW - margin - 8, y + 16, { align: 'right' })

      setFont(doc, 9, 'normal', GRAY_TEXT)
      let iy = y + 30
      iy = wrapText(doc, gap.gap_description || '', margin + 14, iy, contentW - 20, 13)

      iy += 4
      setFont(doc, 8, 'bold', [209, 213, 219])
      doc.text('Current State:', margin + 14, iy)
      setFont(doc, 8, 'normal', GRAY_TEXT)
      iy = wrapText(doc, gap.current_state || '', margin + 90, iy, contentW - 96, 12)

      setFont(doc, 8, 'bold', [209, 213, 219])
      doc.text('Required State:', margin + 14, iy)
      setFont(doc, 8, 'normal', GRAY_TEXT)
      iy = wrapText(doc, gap.required_state || '', margin + 96, iy, contentW - 102, 12)

      if (gap.recommendations?.length) {
        iy += 4
        setFont(doc, 8, 'bold', [209, 213, 219])
        doc.text('Recommendations:', margin + 14, iy)
        iy += 13
        gap.recommendations.forEach((rec) => {
          setFont(doc, 8, 'normal', GRAY_TEXT)
          doc.text('\u2022', margin + 20, iy)
          iy = wrapText(doc, rec, margin + 32, iy, contentW - 40, 12)
        })
      }

      y += cardH + 10
    })
  } else {
    drawRect(doc, margin, y, contentW, 40, DARK_CARD)
    setFont(doc, 9, 'normal', GRAY_TEXT)
    doc.text('No critical gaps identified for the controls evaluated.', margin + 14, y + 24)
    y += 54
  }

  // ── Next Steps ────────────────────────────────────────────────────────────
  if (result.next_steps?.length) {
    if (y > pageH - 140) {
      doc.addPage()
      drawRect(doc, 0, 0, pageW, 4, LIME)
      y = 30
    }
    setFont(doc, 9, 'normal', LIME)
    doc.text('RECOMMENDED NEXT STEPS', margin, y)
    y += 16

    result.next_steps.forEach((step, i) => {
      drawRect(doc, margin, y - 10, 18, 18, [30, 30, 30])
      setFont(doc, 7, 'bold', LIME)
      doc.text(String(i + 1), margin + 9, y + 2, { align: 'center' })
      setFont(doc, 9, 'normal', GRAY_TEXT)
      y = wrapText(doc, step, margin + 26, y, contentW - 30, 13)
      y += 4
    })
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawRect(doc, 0, pageH - 28, pageW, 28, BLACK)
    setFont(doc, 7, 'normal', GRAY_TEXT)
    doc.text('COMPLAI \u2014 Compliance Intelligence Platform', margin, pageH - 10)
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 10, { align: 'right' })
    doc.text(`CONFIDENTIAL \u2014 ${orgName}`, pageW / 2, pageH - 10, { align: 'center' })
  }

  const fileName = `GapAnalysis_${orgName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(fileName)
}
