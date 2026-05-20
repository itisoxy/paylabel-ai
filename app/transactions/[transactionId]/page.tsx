import { notFound } from 'next/navigation'
import Link from 'next/link'
import TransactionDetailClient from '@/app/components/transaction-detail-client'
import { getTransactionById, transactions } from '@/data/paylabel'

export async function generateStaticParams() {
  return transactions.map((transaction) => ({
    transactionId: transaction.transactionId,
  }))
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>
}) {
  const { transactionId } = await params
  const transaction = getTransactionById(transactionId)

  if (!transaction) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            PayLabel AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Transaction detail
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Review a single synthetic payment event and apply your annotation
            decisions.
          </p>
        </div>
        <Link
          href="/transactions"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to queue
        </Link>
      </div>

      <TransactionDetailClient transaction={transaction} />
    </div>
  )
}
