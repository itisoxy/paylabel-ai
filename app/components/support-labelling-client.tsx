'use client'

import { useEffect, useState } from 'react'
import { supportLabels, type SupportConversation } from '@/data/paylabel'
import type { AnnotationConfidence } from '@/data/paylabel'
import {
  loadPaylabelStore,
  saveSupportAnnotation,
} from '@/app/components/paylabel-storage'

type Props = {
  conversations: SupportConversation[]
}

export default function SupportLabellingClient({ conversations }: Props) {
  const [index, setIndex] = useState(0)
  const [selectedLabel, setSelectedLabel] = useState(conversations[0]?.label ?? '')
  const [confidence, setConfidence] = useState<AnnotationConfidence>(
    conversations[0]?.confidence ?? 'medium',
  )
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const conversation = conversations[index]

  useEffect(() => {
    const stored = loadPaylabelStore().support[conversation.conversationId]

    if (!stored) {
      setSelectedLabel(conversation.label)
      setConfidence(conversation.confidence)
      setNotes('')
      return
    }

    setSelectedLabel(stored.label)
    setConfidence(stored.confidence)
    setNotes(stored.notes)
  }, [conversation.conversationId, conversation.confidence, conversation.label])

  function saveLabel() {
    saveSupportAnnotation(conversation.conversationId, {
      label: selectedLabel,
      confidence,
      notes,
    })
    setSaved(true)
  }

  function nextConversation() {
    setSaved(false)
    setNotes('')

    if (index < conversations.length - 1) {
      const next = conversations[index + 1]
      setIndex(index + 1)
      setSelectedLabel(next.label)
      setConfidence(next.confidence)
      return
    }

    setIndex(0)
    setSelectedLabel(conversations[0].label)
    setConfidence(conversations[0].confidence)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Support conversation labelling
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Conversation {conversation.conversationId}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Label payment support messages that indicate disputes, fraud
              signals, or account verification friction.
            </p>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            {index + 1} / {conversations.length}
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-800">
              {conversation.channel}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-800">
              {conversation.sentiment}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-800">
              {conversation.merchantName}
            </span>
          </div>
          <p className="mt-4 text-lg leading-8 text-slate-900">
            {conversation.message}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-900">Label</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {supportLabels.map((label) => {
              const active = selectedLabel === label
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setSelectedLabel(label)
                    setSaved(false)
                  }}
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
              setNotes(event.target.value)
              setSaved(false)
            }}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition focus:border-sky-500"
            placeholder="Add support-review notes or escalation context..."
          />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(['low', 'medium', 'high'] as AnnotationConfidence[]).map((level) => {
            const active = confidence === level
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setConfidence(level)
                  setSaved(false)
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-xs uppercase tracking-[0.2em] opacity-70">
                  Confidence
                </span>
                <span className="mt-1 block text-sm font-semibold capitalize">
                  {level}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveLabel}
            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Save conversation label
          </button>
          <button
            type="button"
            onClick={nextConversation}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Next conversation
          </button>
        </div>

        {saved ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Conversation annotation saved.
          </p>
        ) : null}
      </section>

      <aside className="space-y-6">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Review context
          </p>
          <dl className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-4">
              <dt>Customer</dt>
              <dd className="font-semibold text-slate-950">{conversation.customerId}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Current label</dt>
              <dd className="font-semibold text-slate-950">{selectedLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Status</dt>
              <dd className="font-semibold text-slate-950">
                {saved ? 'reviewed' : conversation.status}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Confidence</dt>
              <dd className="font-semibold text-slate-950 capitalize">{confidence}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            Portfolio note
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-200">
            These mock messages are intended to mirror the kinds of payment
            support interactions fraud, compliance, and ML teams label when
            building training sets and evaluation corpora.
          </p>
        </section>
      </aside>
    </div>
  )
}
