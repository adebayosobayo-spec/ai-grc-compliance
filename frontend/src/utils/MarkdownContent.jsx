/**
 * Shared Markdown renderer for Claude-generated content.
 * Handles pipe tables, bullet lists, numbered lists, bold headings, and paragraphs.
 */

function isSeparatorRow(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim())
}

function parseTableRows(tableLines) {
  return tableLines
    .filter(l => !isSeparatorRow(l))
    .map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

export function MarkdownContent({ content }) {
  if (!content) return null
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // Empty line
    if (!trimmed) { i++; continue }

    // Markdown table: collect consecutive pipe lines and render as styled grid
    if (trimmed.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = parseTableRows(tableLines)
      if (rows.length > 0) {
        elements.push(
          <div key={`t${i}`} className="overflow-x-auto mt-3 mb-3 rounded border border-[#2A2A2A]">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A0A0F]">
                  {rows[0].map((cell, ci) => (
                    <th key={ci} className="text-left px-3 py-2 text-[#1a73e8] font-bold border-b border-[#2A2A2A] whitespace-nowrap">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-[#111111]' : 'bg-[#141414]'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-400 border-b border-[#1A1A1A] leading-relaxed align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // Bullet list: collect consecutive bullet lines
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bullets = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        bullets.push(lines[i].trim().replace(/^[-*]\s+/, ''))
        i++
      }
      elements.push(
        <ul key={`u${i}`} className="space-y-2 mt-2 mb-2">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
              <span>{renderInline(b)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
    if (numMatch) {
      elements.push(
        <div key={`n${i}`} className="flex gap-2 text-sm text-gray-400 my-1 leading-relaxed">
          <span className="text-[#1a73e8] font-bold flex-shrink-0">{numMatch[1]}.</span>
          <span>{renderInline(numMatch[2])}</span>
        </div>
      )
      i++
      continue
    }

    // Standalone bold heading e.g. "**Access Control**"
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      elements.push(
        <p key={`h${i}`} className="text-white font-semibold text-sm mt-4 mb-1">
          {trimmed.slice(2, -2)}
        </p>
      )
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={`p${i}`} className="text-gray-400 text-sm leading-relaxed my-1">
        {renderInline(trimmed)}
      </p>
    )
    i++
  }

  return <div className="space-y-1">{elements}</div>
}

export default MarkdownContent
