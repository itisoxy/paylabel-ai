'use client'

import type {
  AnnotationConfidence,
  SupportConversation,
  TransactionRecord,
} from '@/data/paylabel'

const STORAGE_KEY = 'paylabel-ai:v1'

type StoredTransactionAnnotation = {
  currentLabels: string[]
  notes: string
  confidence: AnnotationConfidence
  reviewed: boolean
  escalatedToCompliance: boolean
  savedAt: string
}

type StoredSupportAnnotation = {
  label: string
  confidence: AnnotationConfidence
  notes: string
  savedAt: string
}

type PaylabelStore = {
  transactions: Record<string, StoredTransactionAnnotation>
  support: Record<string, StoredSupportAnnotation>
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function emptyStore(): PaylabelStore {
  return {
    transactions: {},
    support: {},
  }
}

export function loadPaylabelStore(): PaylabelStore {
  if (!isBrowser()) {
    return emptyStore()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return emptyStore()
    }

    const parsed = JSON.parse(raw) as Partial<PaylabelStore>

    return {
      transactions: parsed.transactions ?? {},
      support: parsed.support ?? {},
    }
  } catch {
    return emptyStore()
  }
}

function persistStore(store: PaylabelStore) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function saveTransactionAnnotation(
  transactionId: string,
  annotation: Omit<StoredTransactionAnnotation, 'savedAt'>,
) {
  const store = loadPaylabelStore()

  store.transactions[transactionId] = {
    ...annotation,
    savedAt: new Date().toISOString(),
  }

  persistStore(store)
}

export function saveSupportAnnotation(
  conversationId: string,
  annotation: Omit<StoredSupportAnnotation, 'savedAt'>,
) {
  const store = loadPaylabelStore()

  store.support[conversationId] = {
    ...annotation,
    savedAt: new Date().toISOString(),
  }

  persistStore(store)
}

export function mergeStoredTransaction(
  transaction: TransactionRecord,
  store: PaylabelStore,
): TransactionRecord {
  const stored = store.transactions[transaction.transactionId]

  if (!stored) {
    return transaction
  }

  return {
    ...transaction,
    currentLabels: stored.currentLabels,
    notes: stored.notes,
    confidence: stored.confidence,
    reviewed: stored.reviewed,
    escalatedToCompliance: stored.escalatedToCompliance,
    annotationStatus:
      stored.escalatedToCompliance || stored.currentLabels.includes('Compliance escalation')
        ? 'escalated'
        : stored.reviewed
          ? 'completed'
          : transaction.annotationStatus,
  }
}

export function mergeStoredSupportConversation(
  conversation: SupportConversation,
  store: PaylabelStore,
): SupportConversation {
  const stored = store.support[conversation.conversationId]

  if (!stored) {
    return conversation
  }

  return {
    ...conversation,
    label: stored.label,
    confidence: stored.confidence,
    status: 'reviewed',
  }
}

export function buildMergedTransactions(transactions: TransactionRecord[]) {
  const store = loadPaylabelStore()
  return transactions.map((transaction) =>
    mergeStoredTransaction(transaction, store),
  )
}

export function buildMergedSupportConversations(
  conversations: SupportConversation[],
) {
  const store = loadPaylabelStore()
  return conversations.map((conversation) =>
    mergeStoredSupportConversation(conversation, store),
  )
}

export function getStoreSnapshot() {
  return loadPaylabelStore()
}
