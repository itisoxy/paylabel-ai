'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  activityFeed,
  supportConversations,
  transactions,
  type TransactionRecord,
} from '@/data/paylabel'
import {
  buildMergedSupportConversations,
  buildMergedTransactions,
} from '@/app/components/paylabel-storage'

function currency(transaction: TransactionRecord) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: transaction.currency,
    maximumFractionDigits: 0,
  }).format(transaction.amount)
}

function initials(value: string) {
  return value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export default function HomePage() {
  const [mergedTransactions, setMergedTransactions] = useState(transactions)
  const [mergedSupport, setMergedSupport] = useState(supportConversations)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setMergedTransactions(buildMergedTransactions(transactions))
    setMergedSupport(buildMergedSupportConversations(supportConversations))
  }, [])

  const stats = useMemo(() => {
    const reviewed = mergedTransactions.filter((item) => item.reviewed).length
    const pending = mergedTransactions.filter((item) => !item.reviewed).length
    const escalated = mergedTransactions.filter(
      (item) => item.escalatedToCompliance,
    ).length
    const disputed = mergedTransactions.filter(
      (item) => item.status === 'disputed',
    ).length
    const totalValue = mergedTransactions.reduce((sum, item) => sum + item.amount, 0)
    const averageRisk = Math.round(
      mergedTransactions.reduce((sum, item) => sum + item.riskScore, 0) /
        mergedTransactions.length,
    )

    return {
      averageRisk,
      disputed,
      escalated,
      pending,
      reviewed,
      reviewedRate: Math.round((reviewed / mergedTransactions.length) * 100),
      totalValue,
    }
  }, [mergedTransactions])

  const filteredQueue = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mergedTransactions
      .filter((transaction) =>
        [
          transaction.transactionId,
          transaction.customerId,
          transaction.merchantName,
          transaction.currentLabels.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 6)
  }, [mergedTransactions, search])

  const topCases = [...mergedTransactions]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3)

  const labels = useMemo(() => {
    const counts = new Map<string, number>()

    for (const transaction of mergedTransactions) {
      for (const label of transaction.currentLabels) {
        counts.set(label, (counts.get(label) ?? 0) + 1)
      }
    }

    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [mergedTransactions])

  const maxLabel = Math.max(...labels.map((item) => item.count), 1)
  const reviewedSupport = mergedSupport.filter(
    (conversation) => conversation.status === 'reviewed',
  ).length
  const weeklyBars = [44, 72, 46, 58, 88, 36, 76]

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            PayLabel AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Payment Risk Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Monitor synthetic payment risk, review dispute signals, and prepare
            labelled data for fraud and compliance workflows.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto">
          <label className="relative block min-w-[280px] flex-1 xl:w-[360px] xl:flex-none">
            <span className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-blue-600/60" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions, merchants, labels"
              className="h-12 w-full rounded-md border border-sky-100 bg-sky-50 pl-12 pr-5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_230px]">
            <section className="rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-100 p-7">
              <p className="text-center text-sm font-semibold text-sky-800">
                Labelled payment volume
              </p>
              <p className="mt-2 text-center text-5xl font-semibold tracking-tight text-slate-950">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(stats.totalValue)}
              </p>

              <div className="mt-8 grid grid-cols-4 gap-4">
                {[
                  ['Queue', 'Review', '/transactions'],
                  ['Ex', 'Export', '/export'],
                  ['Risk', 'Review', '/review'],
                  ['Chat', 'Support', '/support'],
                ].map(([icon, label, href]) => (
                  <Link key={`${label}-${href}`} href={href} className="text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-sky-200 bg-white text-xs font-semibold text-sky-800 transition hover:border-sky-500 hover:bg-sky-600 hover:text-white">
                      {icon}
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-slate-700">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-sky-100 bg-sky-50 p-5">
              <div className="flex items-start justify-between">
                <p className="text-2xl font-semibold text-slate-950">Risk</p>
                <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-sky-700">
                  Live
                </span>
              </div>
              <p className="mt-12 text-sm font-medium text-slate-500">
                Avg score
              </p>
              <p className="mt-2 text-4xl font-semibold text-slate-950">
                {stats.averageRisk}
              </p>
              <div className="mt-8 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{stats.escalated} escalated</span>
                <span>{stats.reviewedRate}% done</span>
              </div>
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Quick review</h2>
            <div className="mt-4 grid grid-cols-4 gap-4 rounded-lg border border-sky-100 bg-sky-50 p-5 sm:grid-cols-8">
              <Link
                href="/transactions"
                className="grid h-14 place-items-center rounded-md border border-sky-200 bg-white text-2xl font-light text-sky-800 transition hover:border-sky-500 hover:bg-sky-600 hover:text-white"
              >
                +
              </Link>
              {topCases.map((transaction) => (
                <button
                  key={transaction.transactionId}
                  type="button"
                  className="text-center"
                >
                  <span
                    className="mx-auto grid h-14 w-full place-items-center rounded-md border border-sky-200 bg-white text-sm font-semibold text-sky-800 transition hover:border-sky-500 hover:bg-sky-600 hover:text-white"
                  >
                    {initials(transaction.merchantName)}
                  </span>
                  <span className="mt-2 block truncate text-xs font-semibold text-slate-600">
                    {transaction.merchantName.split(' ')[0]}
                  </span>
                </button>
              ))}
              {mergedSupport.slice(0, 4).map((conversation) => (
                <span key={conversation.conversationId} className="text-center">
                  <span className="mx-auto grid h-14 w-full place-items-center rounded-md border border-sky-100 bg-white text-xs font-semibold text-sky-800">
                    {conversation.customerId.slice(-2)}
                  </span>
                  <span className="mt-2 block truncate text-xs font-semibold text-slate-600">
                    {conversation.label.split(' ')[0]}
                  </span>
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-950">Transactions</h2>
            <div className="mt-4 space-y-4">
              {filteredQueue.map((transaction) => (
                <button
                  key={transaction.transactionId}
                  type="button"
                  className="grid w-full grid-cols-[52px_1fr_auto] items-center gap-4 rounded-md border border-sky-100 bg-white p-4 text-left transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-sky-50 text-lg font-semibold text-sky-800">
                    {transaction.merchantName[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-slate-950">
                      {transaction.merchantName}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-slate-500">
                      {transaction.transactionId} - {transaction.annotationStatus}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-base font-semibold text-slate-950">
                      {transaction.amount > 500 ? '-' : '+'}
                      {currency(transaction)}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-slate-500">
                      Risk {transaction.riskScore}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {topCases.map((transaction, index) => (
              <button
                key={transaction.transactionId}
                type="button"
                className="rounded-lg border border-sky-100 bg-sky-50 p-5 text-left transition hover:border-sky-300 hover:bg-sky-100"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xl font-semibold text-slate-950">Case</p>
                  <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-sky-700">
                    {index + 1}
                  </span>
                </div>
                <p className="mt-10 text-sm font-medium text-slate-500">
                  {transaction.currentLabels[0] ?? 'Other'}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {currency(transaction)}
                </p>
                <div className="mt-7 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{transaction.transactionId}</span>
                  <span>Risk {transaction.riskScore}</span>
                </div>
              </button>
            ))}
          </div>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-950">Statistics</h2>
              <div className="flex rounded-md border border-sky-100 bg-sky-50 p-1">
                <span className="rounded-md px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-sky-800">
                  Weekly
                </span>
                <span className="rounded-md px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-sky-800">
                  Monthly
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-md border border-sky-100 bg-white text-sm font-semibold text-sky-800">
                  CH
                </span>
                <Link
                  href="/review"
                  className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-600 hover:text-white"
                >
                  Details
                </Link>
              </div>

              <p className="mt-5 text-4xl font-semibold text-slate-950">
                {stats.reviewed}
                <span className="text-2xl"> reviewed</span>
              </p>

              <div className="mt-8 grid h-44 grid-cols-7 items-end gap-3">
                {weeklyBars.map((bar, index) => (
                  <div key={index} className="flex h-full items-end gap-1.5">
                    <div
                      className="w-full rounded-t-md bg-sky-200"
                      style={{ height: `${Math.max(bar - 28, 18)}%` }}
                    />
                    <div
                      className="w-full rounded-t-md bg-sky-600"
                      style={{ height: `${bar}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="rounded-lg border border-sky-100 bg-sky-50 p-5">
              <h2 className="text-2xl font-semibold text-slate-950">Label bars</h2>
              <div className="mt-5 space-y-4">
                {labels.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-md bg-white">
                      <div
                        className="h-full rounded-md bg-sky-600"
                        style={{ width: `${(item.count / maxLabel) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-sky-100 bg-sky-600 p-5 text-white">
                <p className="text-sm font-semibold text-white/70">Pending</p>
                <p className="mt-2 text-4xl font-semibold">{stats.pending}</p>
              </div>
              <div className="rounded-lg border border-sky-100 bg-sky-100 p-5">
                <p className="text-sm font-semibold text-slate-600">Support</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">
                  {reviewedSupport}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-lg border border-sky-100 bg-sky-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-950">Activity</h2>
          <span className="rounded-md border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-800">
            Live
          </span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {activityFeed.map((item) => (
            <div key={item.id} className="rounded-md bg-white p-5 ring-1 ring-sky-100">
              <span className="inline-flex rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                {item.timestamp}
              </span>
              <p className="mt-4 text-lg font-semibold text-slate-950">
                {item.action}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
