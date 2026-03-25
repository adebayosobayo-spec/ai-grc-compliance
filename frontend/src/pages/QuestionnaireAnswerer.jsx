import React, { useState, useRef } from 'react'
import { complianceAPI } from '../services/api'
import { useAppContext } from '../context/AppContext'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

const inputCls = 'mt-1 block w-full bg-white border border-gray-300 text-slate-900 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400'

const SAMPLE_QUESTIONS = [
  'Do you have a documented information security policy?',
  'Do you perform regular risk assessments?',
  'Do you have an incident response plan?',
  'How do you handle data subject access requests?',
  'Do you encrypt data at rest and in transit?',
  'Do you have a business continuity / disaster recovery plan?',
  'How do you manage third-party vendor risk?',
  'Do you provide security awareness training to employees?',
]

const ACCEPTED_FILE_TYPES = '.txt,.csv,.docx,.pdf,.xlsx,.xls,.doc,.rtf'

// ── File parsing utilities ──────────────────────────────────────

async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (['txt', 'csv', 'rtf'].includes(ext)) {
    return await file.text()
  }

  if (['doc', 'docx'].includes(ext)) {
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.default.extractRawText({ arrayBuffer })
    return result.value
  }

  if (ext === 'pdf') {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      pages.push(content.items.map(item => item.str).join(' '))
    }
    return pages.join('\n')
  }

  if (['xlsx', 'xls'].includes(ext)) {
    const XLSX = await import('xlsx')
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const allText = []
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      allText.push(csv)
    }
    return allText.join('\n')
  }

  throw new Error(`Unsupported file type: .${ext}`)
}

function parseQuestionsFromText(text) {
  return text
    .split('\n')
    .map(l => l.replace(/^\d+[\.\)\-\:\s]+/, '').trim())
    .filter(l => l.length > 5 && l.includes('?') || l.length > 20)
    .filter(l => l.length > 0)
}

// ── Export utilities ─────────────────────────────────────────────

function exportAsPDF(result) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let y = 20

  const checkPage = (needed = 30) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      y = 20
    }
  }

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Vendor Questionnaire Responses', margin, y)
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Organisation: ${result.organization_name}`, margin, y); y += 5
  doc.text(`Framework: ${result.framework}`, margin, y); y += 5
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y); y += 5
  doc.text(`Total Questions: ${result.summary.total_questions} | High: ${result.summary.high_confidence} | Medium: ${result.summary.medium_confidence} | Low: ${result.summary.low_confidence}`, margin, y)
  y += 10

  // Recommendation
  if (result.summary.recommendation) {
    checkPage(20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Recommendation:', margin, y); y += 5
    doc.setFont('helvetica', 'normal')
    const recLines = doc.splitTextToSize(result.summary.recommendation, maxWidth)
    doc.text(recLines, margin, y)
    y += recLines.length * 4 + 6
  }

  // Divider
  doc.setDrawColor(200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Answers
  for (const a of result.answers) {
    checkPage(40)

    // Question
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const qLines = doc.splitTextToSize(`Q${a.question_number}: ${a.question}`, maxWidth)
    doc.text(qLines, margin, y)
    y += qLines.length * 5 + 2

    // Confidence badge
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const confColor = a.confidence === 'high' ? [34, 139, 34] : a.confidence === 'medium' ? [200, 150, 0] : [200, 50, 50]
    doc.setTextColor(...confColor)
    doc.text(`Confidence: ${a.confidence.toUpperCase()}`, margin, y)
    doc.setTextColor(0)
    y += 5

    // Answer
    doc.setFontSize(10)
    const aLines = doc.splitTextToSize(a.answer, maxWidth)
    checkPage(aLines.length * 5 + 10)
    doc.text(aLines, margin, y)
    y += aLines.length * 5 + 3

    // Confidence reason
    doc.setFontSize(8)
    doc.setTextColor(120)
    const rLines = doc.splitTextToSize(a.confidence_reason, maxWidth)
    doc.text(rLines, margin, y)
    doc.setTextColor(0)
    y += rLines.length * 4 + 8

    // Separator
    doc.setDrawColor(230)
    doc.line(margin, y - 3, pageWidth - margin, y - 3)
  }

  doc.save(`questionnaire-answers-${Date.now()}.pdf`)
}

async function exportAsDOCX(result) {
  const confidenceColor = (level) =>
    level === 'high' ? '228B22' : level === 'medium' ? 'CC9900' : 'CC3333'

  const answerRows = result.answers.map(a => [
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `Q${a.question_number}: `, bold: true, size: 22 }),
        new TextRun({ text: a.question, bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: 'Confidence: ', size: 18, italics: true }),
        new TextRun({ text: a.confidence.toUpperCase(), size: 18, bold: true, color: confidenceColor(a.confidence) }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: a.answer, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: a.confidence_reason, size: 18, italics: true, color: '888888' }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
      children: [],
    }),
  ]).flat()

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: 'Vendor Questionnaire Responses', bold: true })],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Organisation: ', bold: true, size: 22 }),
            new TextRun({ text: result.organization_name, size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Framework: ', bold: true, size: 22 }),
            new TextRun({ text: result.framework, size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: 'Date: ', bold: true, size: 22 }),
            new TextRun({ text: new Date().toLocaleDateString(), size: 22 }),
          ],
        }),
        // Summary table
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ['Total', 'High', 'Medium', 'Low'].map(label =>
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: label, bold: true, size: 20 })],
                  })],
                })
              ),
            }),
            new TableRow({
              children: [
                result.summary.total_questions,
                result.summary.high_confidence,
                result.summary.medium_confidence,
                result.summary.low_confidence,
              ].map(val =>
                new TableCell({
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: String(val), size: 20 })],
                  })],
                })
              ),
            }),
          ],
        }),
        ...(result.summary.recommendation ? [
          new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Recommendation: ', bold: true, size: 22 }),
              new TextRun({ text: result.summary.recommendation, size: 22 }),
            ],
          }),
        ] : []),
        new Paragraph({
          spacing: { before: 200, after: 200 },
          border: { bottom: { style: BorderStyle.THICK_THIN_LARGE_GAP, size: 3, color: '333333' } },
          children: [],
        }),
        ...answerRows,
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `questionnaire-answers-${Date.now()}.docx`)
}

// ── Main component ──────────────────────────────────────────────

function QuestionnaireAnswerer() {
  const { orgProfile } = useAppContext()
  const framework = orgProfile?.compliance_framework || 'ISO_27001'
  const [questions, setQuestions] = useState([''])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pasteMode, setPasteMode] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([])
  const [fileLoading, setFileLoading] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const fileInputRef = useRef(null)

  const addQuestion = () => setQuestions([...questions, ''])
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index))
  const updateQuestion = (index, value) => {
    const updated = [...questions]
    updated[index] = value
    setQuestions(updated)
  }

  const loadSamples = () => {
    setQuestions([...SAMPLE_QUESTIONS])
    setAttachedFiles([])
  }

  const parseBulkText = () => {
    const lines = bulkText
      .split('\n')
      .map(l => l.replace(/^\d+[\.\)\-\s]+/, '').trim())
      .filter(l => l.length > 0)
    if (lines.length > 0) {
      setQuestions(lines)
      setPasteMode(false)
      setBulkText('')
    }
  }

  // ── File handling ──────────────────────────────────────
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setFileLoading(true)
    setError(null)

    try {
      const allQuestions = []
      const fileNames = []

      for (const file of files) {
        const text = await extractTextFromFile(file)
        const parsed = parseQuestionsFromText(text)
        if (parsed.length === 0) {
          // If no questions detected, treat each non-empty line as a question
          const fallback = text.split('\n').map(l => l.trim()).filter(l => l.length > 5)
          allQuestions.push(...fallback)
        } else {
          allQuestions.push(...parsed)
        }
        fileNames.push(file.name)
      }

      if (allQuestions.length === 0) {
        setError(`Could not extract any questions from ${fileNames.join(', ')}. Try pasting the questions instead.`)
      } else {
        // Merge with existing non-empty questions or replace
        const existing = questions.filter(q => q.trim() !== '')
        setQuestions(existing.length > 0 && existing[0] !== '' ? [...existing, ...allQuestions] : allQuestions)
        setAttachedFiles(prev => [...prev, ...fileNames])
      }
    } catch (err) {
      console.error('File parsing error:', err)
      setError(`Failed to read file: ${err.message}`)
    } finally {
      setFileLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const filtered = questions.filter(q => q.trim() !== '')
    if (filtered.length === 0) {
      setError('Please add at least one question.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const response = await complianceAPI.answerQuestionnaire({
        framework,
        questions: filtered,
      })
      setResult(response)
    } catch (err) {
      if (err.isRateLimited) {
        setError(`Too many requests. Please wait ${err.retryAfter || 60} seconds.`)
        return
      }
      const detail = err.response?.data?.detail
      setError(detail || 'Failed to answer questionnaire. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyAnswer = (text) => {
    navigator.clipboard.writeText(text)
  }

  const confidenceBadge = (level) => {
    const styles = {
      high: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-red-100 text-red-800 border-red-200',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[level] || styles.medium}`}>
        {level}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Questionnaire Answerer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a questionnaire file, paste questions, or type them manually — get accurate, professional
          answers based on your company's compliance profile.
        </p>
      </div>

      {/* No profile warning */}
      {!orgProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">Complete onboarding first</p>
              <p className="text-sm text-amber-700 mt-1">
                We need your company profile to generate accurate answers. Please complete <a href="/onboarding" className="underline font-medium">onboarding</a> before using this feature.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      {!result && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File upload zone */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Upload Questionnaire</h2>
            <p className="text-xs text-slate-500">
              Upload a file containing questionnaire questions. Supports PDF, DOCX, XLSX, CSV, and TXT files.
            </p>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary-400', 'bg-primary-50/30') }}
              onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary-400', 'bg-primary-50/30') }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('border-primary-400', 'bg-primary-50/30')
                const dt = e.dataTransfer
                if (dt.files.length > 0) {
                  const fakeEvent = { target: { files: dt.files } }
                  handleFileSelect(fakeEvent)
                }
              }}
            >
              {fileLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-sm text-slate-600">Extracting questions from file...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-sm text-slate-600">
                    <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOCX, XLSX, CSV, TXT (max 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Attached files list */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((name, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-xs text-primary-700">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {name}
                    <button type="button" onClick={() => removeFile(i)} className="hover:text-red-500">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Questions (manual / bulk paste) */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Questions
                {questions.filter(q => q.trim()).length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({questions.filter(q => q.trim()).length} loaded)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPasteMode(!pasteMode)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {pasteMode ? 'Manual entry' : 'Bulk paste'}
                </button>
                <button
                  type="button"
                  onClick={loadSamples}
                  className="text-sm text-slate-500 hover:text-slate-700 font-medium"
                >
                  Load samples
                </button>
              </div>
            </div>

            {pasteMode ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Paste all your questions below, one per line. Numbering will be stripped automatically.
                </p>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={"1. Do you have a documented information security policy?\n2. Do you perform regular risk assessments?\n3. Do you have an incident response plan?"}
                  rows={8}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={parseBulkText}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Parse questions ({bulkText.split('\n').filter(l => l.trim()).length} detected)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs text-slate-400 font-mono mt-3 w-6 text-right flex-shrink-0">{i + 1}.</span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => updateQuestion(i, e.target.value)}
                      placeholder="Type a questionnaire question..."
                      className={inputCls + ' flex-1'}
                    />
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        className="mt-1.5 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove question"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium pl-8"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add question
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !orgProfile}
            className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating answers...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Answer questionnaire with AI
              </>
            )}
          </button>
        </form>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Answers for {result.organization_name}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {result.summary.total_questions} questions answered
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {result.summary.high_confidence} high
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    {result.summary.medium_confidence} medium
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {result.summary.low_confidence} low
                  </span>
                </div>

                {/* Export dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportOpen(!exportOpen)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export
                    <svg className={`w-3 h-3 transition-transform ${exportOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {exportOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                        <button
                          onClick={() => { exportAsPDF(result); setExportOpen(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2.5"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Export as PDF
                        </button>
                        <button
                          onClick={() => { exportAsDOCX(result); setExportOpen(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2.5"
                        >
                          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Export as DOCX
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {result.summary.recommendation && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Recommendation: </span>
                  {result.summary.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Individual answers */}
          <div className="space-y-4">
            {result.answers.map((a, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {a.question_number}
                    </span>
                    <p className="text-sm font-medium text-slate-900">{a.question}</p>
                  </div>
                  {confidenceBadge(a.confidence)}
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{a.answer}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <p className="text-xs text-slate-400 italic">{a.confidence_reason}</p>
                    <button
                      onClick={() => copyAnswer(a.answer)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start over */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => { setResult(null); setQuestions(['']); setError(null); setAttachedFiles([]); setExportOpen(false) }}
              className="px-5 py-2.5 border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Answer another questionnaire
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionnaireAnswerer
