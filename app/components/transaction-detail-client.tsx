'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AnnotationConfidence, TransactionRecord } from '@/data/paylabel'
import {
  confidenceLevels,
  getMaskedPaymentDescriptor,
  transactionLabels,
} from '@/data/paylabel'
import {
  loadPaylabelStore,
  saveTransactionAnnotation,
} from '@/app/components/paylabel-storage'

type Props = {
  transaction: TransactionRecord
}

export default function TransactionDetailClient({ transaction }: Props) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    transaction.currentLabels,
  )
  const [notes, setNotes] = useState(transaction.notes)
  const [confidence, setConfidence] =
    useState<AnnotationConfidence>(transaction.confidence)
  const [reviewed, setReviewed] = useState(transaction.reviewed)
  const [escalatedToCompliance, setEscalatedToCompliance] = useState(
    transaction.escalatedToCompliance,
  )
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = loadPaylabelStore().transactions[transaction.transactionId]

    if (!stored) {
      return
    }

    setSelectedLabels(stored.currentLabels)
    setNotes(stored.notes)
    setConfidence(stored.confidence)
    setReviewed(stored.reviewed)
    setEscalatedToCompliance(stored.escalatedToCompliance)
  }, [transaction.transactionId])

  const riskBand = useMemo(() => {
    if (transaction.riskScore >= 75) return 'Critical'
    if (transaction.riskScore >= 50) return 'Elevated'
    return 'Routine'
  }, [transaction.riskScore])

  function toggleLabel(label: string) {
    setSaved(false)
    setSelectedLabels((current) =>
      current.includes(label)
        ? current.filter((value) => value !== label)
        : [...current, label],
    )
  }

  function saveAnnotation() {
    saveTransactionAnnotation(transaction.transactionId, {
      currentLabels: selectedLabels,
      notes,
      confidence,
      reviewed: true,
      escalatedToCompliance,
    })
    setReviewed(true)
    setSaved(true)
  }

  function resetAnnotation() {
    saveTransactionAnnotation(transaction.transactionId, {
      currentLabels: transaction.currentLabels,
      notes: transaction.notes,
      confidence: transaction.confidence,
      reviewed: transaction.reviewed,
      escalatedToCompliance: transaction.escalatedToCompliance,
    })
    setSelectedLabels(transaction.currentLabels)
    setNotes(transaction.notes)
    setConfidence(transaction.confidence)
    setReviewed(transaction.reviewed)
    setEscalatedToCompliance(transaction.escalatedToCompliance)
    setSaved(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Transaction detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              {transaction.transactionId}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review the synthetic payment event, apply labels, and capture a
              compliance-ready annotation trail.
            </p>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Risk {transaction.riskScore} · {riskBand}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ['Customer', transaction.customerId],
            ['Merchant', transaction.merchantName],
            ['Amount', `${transaction.currency} ${transaction.amount.toLocaleString()}`],
            ['Method', transaction.paymentMethod],
            ['Masked instrument', getMaskedPaymentDescriptor(transaction)],
            ['Status', transaction.status],
            ['Country', transaction.country],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {label}
              </dt>
              <dd className="mt-2 text-base font-semibold text-slate-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Labels</p>
              <p className="text-sm text-slate-600">
                Select one or more payment labels for training and evaluation.
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {selectedLabels.length} selected
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {transactionLabels.map((label) => {
              const active = selectedLabels.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-900">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => {
              setSaved(false)
              setNotes(event.target.value)
            }}
            rows={6}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition focus:border-sky-500"
            placeholder="Summarize why this payment was labeled this way..."
          />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Confidence</p>
            <div className="mt-2 flex gap-2">
              {confidenceLevels.map((level) => {
                const active = confidence === level
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setSaved(false)
                      setConfidence(level)
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                      active
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(event) => {
                setSaved(false)
                setReviewed(event.target.checked)
              }}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            <span className="text-sm font-medium text-slate-800">
              Mark as reviewed
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={escalatedToCompliance}
              onChange={(event) => {
                setSaved(false)
                setEscalatedToCompliance(event.target.checked)
              }}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            <span className="text-sm font-medium text-slate-800">
              Escalate to compliance
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveAnnotation}
            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Save annotation
          </button>
          <button
            type="button"
            onClick={resetAnnotation}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>

        {saved ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Annotation saved for synthetic portfolio review.
          </p>
        ) : null}
      </section>

      <aside className="space-y-6">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Risk context
          </p>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Annotation status</span>
              <span className="font-semibold text-slate-950">
                {transaction.annotationStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reviewed</span>
              <span className="font-semibold text-slate-950">
                {reviewed ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Compliance escalation</span>
              <span className="font-semibold text-slate-950">
                {escalatedToCompliance ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current labels</span>
              <span className="font-semibold text-slate-950">
                {selectedLabels.length}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            Synthetic data notice
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-200">
            Every payment record in PayLabel AI is mock data only. Card numbers
            are masked, no PAN, CVV, or authentication data is stored, and the
            workflow is designed to mirror PCI-aware review processes without
            exposing real cardholder data.
          </p>
        </section>
      </aside>
    </div>
  )
}
