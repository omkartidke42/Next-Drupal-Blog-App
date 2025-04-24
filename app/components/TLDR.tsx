'use client'

import { useEffect, useState } from 'react'

export default function TLDR({ content }: { content: string }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })

        const data = await res.json()
        setSummary(data.summary)
      } catch (err) {
        setSummary('Could not generate summary.')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [content])

  return (
    <div className="bg-blue-100 text-blue-900 px-4 py-3 rounded mb-6">
      <strong>TL;DR:</strong>{' '}
      {loading ? <span>Generating summary...</span> : <span>{summary}</span>}
    </div>
  )
}
