import SupportLabellingClient from '@/app/components/support-labelling-client'
import Link from 'next/link'
import { supportConversations } from '@/data/paylabel'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            PayLabel AI
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Support labelling
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Tag customer support conversations that hint at payment failure,
            chargebacks, verification issues, or fraud concerns.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to dashboard
        </Link>
      </div>

      <SupportLabellingClient conversations={supportConversations} />
    </div>
  )
}
