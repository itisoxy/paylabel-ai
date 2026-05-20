'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  getMaskedPaymentDescriptor,
  transactions,
} from '@/data/paylabel'
import { buildMergedTransactions } from '@/app/components/paylabel-storage'

function statusClasses(status: string) {
  switch (status) {
    case 'successful':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'failed':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'disputed':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

function riskClasses(score: number) {
  if (score >= 70) return 'bg-rose-500'
  if (score >= 45) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export default function TransactionsPage() {
  const [mergedTransactions, setMergedTransactions] = useState(transactions)

  useEffect(() => {
    setMergedTransactions(buildMergedTransactions(transactions))
  }, [])

  const queueStats = useMemo(() => {
    const escalated = mergedTransactions.filter(
      (transaction) => transaction.annotationStatus === 'escalated',
    ).length
    const inProgress = mergedTransactions.filter(
      (transaction) => transaction.annotationStatus === 'in progress',
    ).length
    const avgRisk = Math.round(
      mergedTransactions.reduce(
        (total, transaction) => total + transaction.riskScore,
        0,
      ) / mergedTransactions.length,
    )

    return [
      ['Rows', mergedTransactions.length.toString()],
      ['Escalated', escalated.toString()],
      ['In progress', inProgress.toString()],
      ['Avg risk', avgRisk.toString()],
    ]
  }, [mergedTransactions])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Transaction operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Transaction queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Masked payment records with risk scoring, annotation state, and
            analyst review actions.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to dashboard
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {queueStats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex flex-wrap gap-2">
            {['All records', 'Escalated', 'Failed', 'Disputed'].map((item, index) => (
              <span
                key={item}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                  index === 0
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-500">
            Showing locally merged annotations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Label state</th>
                  <th className="px-4 py-3">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {mergedTransactions.map((transaction) => (
                  <tr
                    key={transaction.transactionId}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {transaction.transactionId}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {transaction.customerId}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {transaction.merchantName}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {transaction.currency} {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      <span className="block capitalize">
                        {transaction.paymentMethod}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {getMaskedPaymentDescriptor(transaction)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses(
                          transaction.status,
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-28 items-center gap-3">
                        <span className="w-7 font-semibold text-slate-950">
                          {transaction.riskScore}
                        </span>
                        <span className="h-2 flex-1 rounded-full bg-slate-100">
                          <span
                            className={`block h-2 rounded-full ${riskClasses(
                              transaction.riskScore,
                            )}`}
                            style={{ width: `${transaction.riskScore}%` }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize text-slate-700">
                      {transaction.annotationStatus}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/transactions/${transaction.transactionId}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}
