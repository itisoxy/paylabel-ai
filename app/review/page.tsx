import Link from 'next/link'
import { reviewQueue } from '@/data/paylabel'

function reviewStatusStyles(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            PayLabel AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Human review queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Use this queue to inspect the annotations that need a second pass
            from analysts or compliance reviewers.
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
        <div className="mb-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          {reviewQueue.length} items
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Assigned reviewer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {reviewQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {item.transactionId}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{item.label}</td>
                  <td className="px-4 py-4 capitalize text-slate-700">
                    {item.confidence}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {item.assignedReviewer}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${reviewStatusStyles(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  )
}
