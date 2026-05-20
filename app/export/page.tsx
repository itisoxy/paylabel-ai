'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { buildExportRows } from '@/data/paylabel'
import { buildMergedTransactions } from '@/app/components/paylabel-storage'
import { transactions } from '@/data/paylabel'

type ExportFormat = 'json' | 'csv'

function toCsv(rows: Array<Record<string, unknown>>) {
  const header = Object.keys(rows[0] ?? {})
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      header
        .map((key) => {
          const value = row[key]
          const serialized =
            typeof value === 'string'
              ? value
              : Array.isArray(value)
                ? value.join('|')
                : String(value ?? '')
          return `"${serialized.replaceAll('"', '""')}"`
        })
        .join(','),
    ),
  ]

  return lines.join('\n')
}

export default function ExportPage() {
  const [rows, setRows] = useState(() => buildExportRows(transactions))
  const [format, setFormat] = useState<ExportFormat>('json')
  const [exported, setExported] = useState(false)

  useEffect(() => {
    setRows(buildExportRows(buildMergedTransactions(transactions)))
  }, [])

  function download() {
    const content =
      format === 'json'
        ? JSON.stringify(rows, null, 2)
        : toCsv(rows as Array<Record<string, unknown>>)

    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `paylabel-export.${format}`
    anchor.click()
    URL.revokeObjectURL(url)
    setExported(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            PayLabel AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Export labelled data
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Export the mock payment corpus as JSON or CSV for model training,
            evaluation, and annotation workflow demos.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <p className="text-sm text-slate-500">
        The export reflects any annotations saved locally in this browser.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {(['json', 'csv'] as const).map((item) => {
          const active = format === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFormat(item)}
              className={`rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                active
                  ? 'bg-slate-950 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          )
        })}
        <button
          type="button"
          onClick={download}
          className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Download export
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['transactionId', 'Included'],
          ['original payment fields', 'Included'],
          ['selected labels', 'Included'],
          ['createdAt', 'Included'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {label}
            </p>
            <p className="mt-2 font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

        {exported ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Export generated locally from synthetic records only.
          </p>
        ) : null}
      </div>
    </div>
  )
}
