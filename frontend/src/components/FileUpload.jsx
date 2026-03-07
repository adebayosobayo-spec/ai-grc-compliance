import React, { useState, useRef } from 'react'
import { complianceAPI } from '../services/api'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_EXTENSIONS = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg'

export default function FileUpload({ sessionId, evidenceId, onUploadComplete }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const inputRef = useRef(null)

  function validate(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not allowed. Use PDF, DOCX, XLSX, PNG, or JPG.'
    }
    if (file.size > MAX_SIZE) {
      return 'File too large. Maximum size is 10 MB.'
    }
    return null
  }

  async function handleFile(file) {
    const err = validate(file)
    if (err) { setError(err); return }

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // 1. Get signed upload URL from backend
      const { upload_url, path } = await complianceAPI.getUploadUrl({
        session_id: sessionId,
        evidence_id: evidenceId,
        filename: file.name,
      })

      // 2. Upload directly to Supabase Storage
      const xhr = new XMLHttpRequest()
      await new Promise((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed: ${xhr.status}`))
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.open('PUT', upload_url)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      setUploadedFile({ name: file.name, path, size: file.size })
      setProgress(100)
      onUploadComplete?.({ name: file.name, path, size: file.size })
    } catch (e) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }

  function onSelect(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-primary-400 bg-primary-50'
            : uploadedFile
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS}
          onChange={onSelect}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="flex items-center justify-center gap-2 text-emerald-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{uploadedFile.name}</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 font-medium">
              {dragging ? 'Drop file here' : 'Click or drag file to upload'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, PNG, JPG (max 10 MB)</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}
