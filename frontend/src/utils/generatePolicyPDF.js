/**
 * Generates a formatted PDF from a policy generation result.
 * Uses jsPDF from CDN (window.jspdf.jsPDF) — no npm install needed.
 *
 * Design: neutral corporate policy document — belongs to the user's organisation.
 * Only a small COMPLAI attribution appears in the footer.
 */

// ── Colour palette (professional corporate document) ────────────────────────
const NAVY        = [11,  25,  44]   // org/document accent
const DARK_TEXT   = [30,  30,  30]   // primary body text
const MED_TEXT    = [90,  90,  90]   // secondary / caption text
const LIGHT_TEXT  = [255, 255, 255]  // text on dark backgrounds
const TBL_HEAD_BG = [45,  65,  95]   // table header background (dark navy)
const TBL_ROW_A   = [247, 248, 250]  // table even row
const TBL_ROW_B   = [255, 255, 255]  // table odd row (white)
const RULE_COLOR  = [200, 205, 210]  // horizontal rules / dividers
const COMPLAI_CLR = [26, 115, 232]   // COMPLAI watermark blue (very subtle)

// ── Helpers ─────────────────────────────────────────────────────────────────
function setFont(doc, size, style = 'normal', color = DARK_TEXT) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style)
  doc.setTextColor(...color)
}

function drawRect(doc, x, y, w, h, fillColor) {
  doc.setFillColor(...fillColor)
  doc.rect(x, y, w, h, 'F')
}

function drawHRule(doc, x, y, w, color = RULE_COLOR) {
  doc.setDrawColor(...color)
  doc.setLineWidth(0.5)
  doc.line(x, y, x + w, y)
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function isSeparatorLine(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim())
}

function parseTableRows(tableLines) {
  return tableLines
    .filter(l => !isSeparatorLine(l))
    .map(l =>
      l.trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(c => c.trim())
    )
}

// ── Table renderer ───────────────────────────────────────────────────────────
function renderTable(doc, rows, x, y, contentW, pageH, pageW, margin) {
  if (!rows || rows.length === 0) return y

  const numCols = Math.max(...rows.map(r => r.length))
  const pad     = 6
  const lineH   = 11

  let colWidths
  if (numCols === 2) {
    colWidths = [contentW * 0.28, contentW * 0.72]
  } else if (numCols === 3) {
    colWidths = [contentW * 0.18, contentW * 0.38, contentW * 0.44]
  } else if (numCols === 4) {
    colWidths = [contentW * 0.11, contentW * 0.17, contentW * 0.42, contentW * 0.30]
  } else {
    colWidths = Array(numCols).fill(contentW / numCols)
  }

  rows.forEach((row, rowIdx) => {
    const isHeader  = rowIdx === 0
    const paddedRow = [...row, ...Array(numCols - row.length).fill('')]

    let maxLines = 1
    paddedRow.forEach((cell, ci) => {
      const n = doc.splitTextToSize(String(cell || ''), colWidths[ci] - pad * 2).length
      if (n > maxLines) maxLines = n
    })
    const rowH = maxLines * lineH + pad * 2

    if (y + rowH > pageH - 50) {
      doc.addPage()
      addPageHeader(doc, pageW, margin)
      y = 50
    }

    const bg = isHeader ? TBL_HEAD_BG : (rowIdx % 2 === 0 ? TBL_ROW_A : TBL_ROW_B)
    drawRect(doc, x, y, contentW, rowH, bg)

    // Subtle border between rows
    doc.setDrawColor(...RULE_COLOR)
    doc.setLineWidth(0.3)
    doc.rect(x, y, contentW, rowH, 'S')

    let cx = x
    paddedRow.forEach((cell, ci) => {
      const cellColor = isHeader ? LIGHT_TEXT : DARK_TEXT
      setFont(doc, isHeader ? 7 : 8, isHeader ? 'bold' : 'normal', cellColor)
      const wrapped = doc.splitTextToSize(String(cell || ''), colWidths[ci] - pad * 2)
      doc.text(wrapped, cx + pad, y + pad + lineH * 0.75)
      cx += colWidths[ci]
    })

    y += rowH
  })

  return y + 8
}

function stripInlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
}

// Thin top accent line on continuation pages (no branding)
function addPageHeader(doc, pageW, margin) {
  drawRect(doc, 0, 0, pageW, 3, NAVY)
}

// ── Section content renderer ─────────────────────────────────────────────────
function renderContent(doc, content, margin, startY, contentW, pageH, pageW) {
  let y = startY
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const raw     = lines[i]
    const trimmed = raw.trim()

    if (!trimmed) { y += 4; i++; continue }

    // Markdown heading ## or ###
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      if (y > pageH - 50) { doc.addPage(); addPageHeader(doc, pageW, margin); y = 40 }
      const headText = stripInlineMarkdown(trimmed.replace(/^#+\s*/, ''))
      setFont(doc, 9, 'bold', NAVY)
      doc.text(headText, margin, y)
      y += 14
      i++
      continue
    }

    // Markdown table — collect consecutive table lines
    if (trimmed.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = parseTableRows(tableLines)
      y = renderTable(doc, rows, margin, y, contentW, pageH, pageW, margin)
      continue
    }

    // Numbered list: "1. item"
    if (/^\d+\.\s/.test(trimmed)) {
      if (y > pageH - 30) { doc.addPage(); addPageHeader(doc, pageW, margin); y = 40 }
      const match = trimmed.match(/^(\d+)\.\s+(.*)/)
      const num   = match[1]
      const text  = stripInlineMarkdown(match[2])
      setFont(doc, 8, 'bold', NAVY)
      doc.text(num + '.', margin + 4, y)
      setFont(doc, 8, 'normal', DARK_TEXT)
      y = wrapText(doc, text, margin + 18, y, contentW - 22, 12)
      y += 2
      i++
      continue
    }

    // Bullet list: "- item" or "* item"
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (y > pageH - 30) { doc.addPage(); addPageHeader(doc, pageW, margin); y = 40 }
      const text = stripInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))
      setFont(doc, 9, 'normal', NAVY)
      doc.text('\u2022', margin + 4, y)
      setFont(doc, 8, 'normal', DARK_TEXT)
      y = wrapText(doc, text, margin + 14, y, contentW - 18, 12)
      y += 2
      i++
      continue
    }

    // **Bold standalone line**
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      if (y > pageH - 30) { doc.addPage(); addPageHeader(doc, pageW, margin); y = 40 }
      const text = trimmed.replace(/\*\*/g, '')
      setFont(doc, 8, 'bold', DARK_TEXT)
      y = wrapText(doc, text, margin, y, contentW, 12)
      y += 3
      i++
      continue
    }

    // Regular paragraph text
    if (y > pageH - 30) { doc.addPage(); addPageHeader(doc, pageW, margin); y = 40 }
    setFont(doc, 8, 'normal', DARK_TEXT)
    y = wrapText(doc, stripInlineMarkdown(trimmed), margin, y, contentW, 12)
    y += 3
    i++
  }

  return y
}

// ── Main export ──────────────────────────────────────────────────────────────
export function generatePolicyPDF(result, orgName, framework) {
  const jsPDF = window.jspdf?.jsPDF
  if (!jsPDF) {
    alert('PDF library not available. Please refresh the page and try again.')
    return
  }

  const doc      = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW    = doc.internal.pageSize.getWidth()
  const pageH    = doc.internal.pageSize.getHeight()
  const margin   = 45
  const contentW = pageW - margin * 2

  const policy   = result.policy
  const fwLabel  = framework === 'ISO_42001' ? 'ISO/IEC 42001:2023' : 'ISO/IEC 27001:2022'
  const dateStr  = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const title    = policy.title || `${orgName} — Policy Document`

  // ── Page 1 Cover Header (organisation-branded, not COMPLAI-branded) ────────
  // Navy top bar
  drawRect(doc, 0, 0, pageW, 110, NAVY)

  // Organisation name (prominent)
  setFont(doc, 10, 'normal', [180, 200, 220])
  doc.text(orgName.toUpperCase(), margin, 38)

  // Policy title (large)
  setFont(doc, 16, 'bold', LIGHT_TEXT)
  const wrappedTitle = doc.splitTextToSize(title, contentW - 20)
  doc.text(wrappedTitle, margin, 58)

  // Framework & date (right-aligned)
  setFont(doc, 8, 'normal', [160, 185, 210])
  doc.text(`${fwLabel}  \u00B7  ${dateStr}`, pageW - margin, 38, { align: 'right' })

  // Metadata bar (light gray beneath header)
  drawRect(doc, 0, 110, pageW, 26, [235, 238, 242])
  setFont(doc, 7.5, 'normal', MED_TEXT)
  doc.text(`Version: ${policy.version || '1.0'}`, margin, 126)
  doc.text(`Effective: ${policy.effective_date || dateStr}`, margin + 100, 126)
  doc.text(`Review Date: ${policy.review_date || 'Annually'}`, margin + 220, 126)
  doc.text('Classification: CONFIDENTIAL', pageW - margin, 126, { align: 'right' })

  drawHRule(doc, 0, 136, pageW)

  let y = 158

  // ── Sections ───────────────────────────────────────────────────────────────
  const sections = policy.sections || []

  for (const section of sections) {
    if (y > pageH - 90) {
      doc.addPage()
      addPageHeader(doc, pageW, margin)
      y = 40
    }

    // Section heading — navy left accent bar + bold text
    drawRect(doc, margin, y, 3, 18, NAVY)
    setFont(doc, 10, 'bold', NAVY)
    const heading = `${section.section_number ? section.section_number + '. ' : ''}${section.section_title || ''}`
    doc.text(heading, margin + 10, y + 13)
    y += 26

    // Section body
    y = renderContent(doc, section.content || '', margin, y, contentW, pageH, pageW)

    // Divider
    y += 4
    drawHRule(doc, margin, y, contentW)
    y += 12
  }

  // ── Related Controls ────────────────────────────────────────────────────────
  if (policy.related_controls?.length > 0) {
    if (y > pageH - 80) {
      doc.addPage()
      addPageHeader(doc, pageW, margin)
      y = 40
    }

    drawRect(doc, margin, y, 3, 16, NAVY)
    setFont(doc, 9, 'bold', NAVY)
    doc.text('RELATED CONTROLS', margin + 10, y + 11)
    y += 24

    setFont(doc, 8, 'normal', MED_TEXT)
    y = wrapText(doc, policy.related_controls.join('   \u00B7   '), margin, y, contentW, 12)
    y += 10
  }

  // ── Footer on every page ────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)

    // Light footer rule
    drawHRule(doc, margin, pageH - 28, contentW, [210, 215, 220])

    // Organisation name left
    setFont(doc, 7, 'normal', MED_TEXT)
    doc.text(orgName, margin, pageH - 14)

    // Page number centre
    doc.text(`Page ${p} of ${totalPages}`, pageW / 2, pageH - 14, { align: 'center' })

    // Small COMPLAI watermark right (subtle — not prominent)
    setFont(doc, 6.5, 'normal', COMPLAI_CLR)
    doc.text('Generated by COMPLAI', pageW - margin, pageH - 14, { align: 'right' })
  }

  const safeName = title.replace(/[\s/\\:*?"<>|]+/g, '_')
  doc.save(`Policy_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`)
}
