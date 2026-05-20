export type TransactionStatus = 'successful' | 'failed' | 'disputed' | 'refunded'
export type PaymentMethod = 'card' | 'bank transfer' | 'wallet'
export type AnnotationConfidence = 'low' | 'medium' | 'high'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type TransactionRecord = {
  transactionId: string
  customerId: string
  merchantName: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  status: TransactionStatus
  riskScore: number
  country: string
  timestamp: string
  annotationStatus: 'unreviewed' | 'in progress' | 'completed' | 'escalated'
  currentLabels: string[]
  notes: string
  confidence: AnnotationConfidence
  reviewed: boolean
  escalatedToCompliance: boolean
}

export type SupportConversation = {
  conversationId: string
  customerId: string
  merchantName: string
  channel: 'chat' | 'email' | 'phone transcript'
  sentiment: 'neutral' | 'frustrated' | 'urgent'
  message: string
  label: string
  confidence: AnnotationConfidence
  status: 'open' | 'reviewed' | 'needs follow-up'
  timestamp: string
}

export type ReviewItem = {
  id: string
  transactionId: string
  label: string
  confidence: AnnotationConfidence
  assignedReviewer: string
  status: ReviewStatus
  notes: string
}

export type ActivityItem = {
  id: string
  action: string
  detail: string
  timestamp: string
}

export const transactionLabels = [
  'Fraud',
  'Not fraud',
  'Suspicious',
  'Chargeback',
  'Failed payment',
  'Refund request',
  'KYC issue',
  'AML review',
  'Compliance escalation',
  'Customer support issue',
]

export const supportLabels = [
  'Payment failed',
  'Refund request',
  'Chargeback threat',
  'Account verification issue',
  'Suspected fraud',
  'Customer confusion',
  'Merchant complaint',
]

export const confidenceLevels: AnnotationConfidence[] = ['low', 'medium', 'high']

export const transactions: TransactionRecord[] = [
  {
    transactionId: 'txn_1001',
    customerId: 'cus_2048',
    merchantName: 'Northstar Travel',
    amount: 219.5,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 18,
    country: 'US',
    timestamp: '2026-05-18T08:42:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Low-value domestic travel booking with verified device fingerprint.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1002',
    customerId: 'cus_2191',
    merchantName: 'CloudCart Marketplace',
    amount: 84.2,
    currency: 'USD',
    paymentMethod: 'wallet',
    status: 'disputed',
    riskScore: 76,
    country: 'GB',
    timestamp: '2026-05-18T09:11:00Z',
    annotationStatus: 'escalated',
    currentLabels: ['Chargeback', 'Suspicious'],
    notes: 'Dispute opened within 24 hours of settlement. Unusual delivery address mismatch.',
    confidence: 'medium',
    reviewed: true,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1003',
    customerId: 'cus_2022',
    merchantName: 'Metro Fitness Club',
    amount: 39,
    currency: 'EUR',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 22,
    country: 'FR',
    timestamp: '2026-05-18T09:25:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Recurring membership with consistent billing cadence.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1004',
    customerId: 'cus_2440',
    merchantName: 'Quantum Gadgets',
    amount: 982.75,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'failed',
    riskScore: 61,
    country: 'US',
    timestamp: '2026-05-18T09:38:00Z',
    annotationStatus: 'in progress',
    currentLabels: ['Failed payment', 'Customer support issue'],
    notes: 'Issuer decline after 3DS challenge. Customer contacted support.',
    confidence: 'medium',
    reviewed: false,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1005',
    customerId: 'cus_2088',
    merchantName: 'Arcadia Games',
    amount: 16.99,
    currency: 'GBP',
    paymentMethod: 'bank transfer',
    status: 'successful',
    riskScore: 28,
    country: 'IE',
    timestamp: '2026-05-18T09:49:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Synthetic low-risk settlement record for wallet top-up flow.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1006',
    customerId: 'cus_2991',
    merchantName: 'BlueWave Electronics',
    amount: 1450,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'disputed',
    riskScore: 89,
    country: 'US',
    timestamp: '2026-05-18T10:03:00Z',
    annotationStatus: 'escalated',
    currentLabels: ['Fraud', 'Chargeback', 'Compliance escalation'],
    notes: 'High-value device purchase, multiple rapid attempts, and manual review requested.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1007',
    customerId: 'cus_2777',
    merchantName: 'SwiftRide',
    amount: 52.3,
    currency: 'CAD',
    paymentMethod: 'wallet',
    status: 'refunded',
    riskScore: 35,
    country: 'CA',
    timestamp: '2026-05-18T10:17:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Refund request'],
    notes: 'Refund issued after duplicate ride charge was confirmed.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1008',
    customerId: 'cus_2504',
    merchantName: 'Harbor Books',
    amount: 28.45,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 14,
    country: 'US',
    timestamp: '2026-05-18T10:29:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Known customer and merchant with stable historical behavior.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1009',
    customerId: 'cus_2668',
    merchantName: 'Apex Hosting',
    amount: 740,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 54,
    country: 'SG',
    timestamp: '2026-05-18T10:41:00Z',
    annotationStatus: 'in progress',
    currentLabels: ['Suspicious', 'AML review'],
    notes: 'Cross-border subscription and elevated amount for merchant profile.',
    confidence: 'medium',
    reviewed: false,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1010',
    customerId: 'cus_2781',
    merchantName: 'Glow Beauty',
    amount: 19.99,
    currency: 'EUR',
    paymentMethod: 'wallet',
    status: 'successful',
    riskScore: 12,
    country: 'ES',
    timestamp: '2026-05-18T10:55:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Small basket size, frequent repeat buyer, no adverse signals.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1011',
    customerId: 'cus_2910',
    merchantName: 'Orbit Telecom',
    amount: 108,
    currency: 'USD',
    paymentMethod: 'bank transfer',
    status: 'failed',
    riskScore: 46,
    country: 'US',
    timestamp: '2026-05-18T11:12:00Z',
    annotationStatus: 'in progress',
    currentLabels: ['Failed payment'],
    notes: 'ACH payment returned due to insufficient funds.',
    confidence: 'high',
    reviewed: false,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1012',
    customerId: 'cus_2334',
    merchantName: 'Nova Air',
    amount: 612.7,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'disputed',
    riskScore: 67,
    country: 'US',
    timestamp: '2026-05-18T11:26:00Z',
    annotationStatus: 'escalated',
    currentLabels: ['Chargeback', 'Customer support issue'],
    notes: 'Customer claims service not received and has contacted support twice.',
    confidence: 'medium',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1013',
    customerId: 'cus_2455',
    merchantName: 'River Market',
    amount: 133.2,
    currency: 'AUD',
    paymentMethod: 'wallet',
    status: 'successful',
    riskScore: 23,
    country: 'AU',
    timestamp: '2026-05-18T11:44:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Normal grocery spend with trusted wallet device.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1014',
    customerId: 'cus_2009',
    merchantName: 'Mint Insurance',
    amount: 301.9,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 58,
    country: 'US',
    timestamp: '2026-05-18T11:58:00Z',
    annotationStatus: 'in progress',
    currentLabels: ['KYC issue'],
    notes: 'Account update pending identity verification for policy change.',
    confidence: 'medium',
    reviewed: false,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1015',
    customerId: 'cus_2833',
    merchantName: 'Signal Cloud',
    amount: 22,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'refunded',
    riskScore: 31,
    country: 'US',
    timestamp: '2026-05-18T12:09:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Refund request'],
    notes: 'Customer requested cancellation after duplicate subscription enrollment.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1016',
    customerId: 'cus_2449',
    merchantName: 'Vertex Market',
    amount: 840,
    currency: 'EUR',
    paymentMethod: 'card',
    status: 'successful',
    riskScore: 72,
    country: 'DE',
    timestamp: '2026-05-18T12:21:00Z',
    annotationStatus: 'escalated',
    currentLabels: ['Suspicious', 'AML review'],
    notes: 'Velocity spike across multiple card attempts and international merchant profile.',
    confidence: 'medium',
    reviewed: true,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1017',
    customerId: 'cus_2119',
    merchantName: 'FreshHome Goods',
    amount: 63.4,
    currency: 'USD',
    paymentMethod: 'wallet',
    status: 'successful',
    riskScore: 19,
    country: 'US',
    timestamp: '2026-05-18T12:36:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Not fraud'],
    notes: 'Stable device and delivery details match prior order history.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1018',
    customerId: 'cus_2997',
    merchantName: 'Nimbus Market',
    amount: 410.55,
    currency: 'USD',
    paymentMethod: 'bank transfer',
    status: 'failed',
    riskScore: 49,
    country: 'US',
    timestamp: '2026-05-18T12:49:00Z',
    annotationStatus: 'in progress',
    currentLabels: ['Failed payment', 'Customer support issue'],
    notes: 'Bank transfer rejected after account ownership verification mismatch.',
    confidence: 'medium',
    reviewed: false,
    escalatedToCompliance: false,
  },
  {
    transactionId: 'txn_1019',
    customerId: 'cus_2722',
    merchantName: 'Summit Sports',
    amount: 251.2,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'disputed',
    riskScore: 69,
    country: 'US',
    timestamp: '2026-05-18T13:04:00Z',
    annotationStatus: 'escalated',
    currentLabels: ['Chargeback', 'Fraud'],
    notes: 'Chargeback aligns with reported card-not-present compromise pattern.',
    confidence: 'high',
    reviewed: true,
    escalatedToCompliance: true,
  },
  {
    transactionId: 'txn_1020',
    customerId: 'cus_2878',
    merchantName: 'Pulse Tickets',
    amount: 128.75,
    currency: 'GBP',
    paymentMethod: 'wallet',
    status: 'successful',
    riskScore: 38,
    country: 'GB',
    timestamp: '2026-05-18T13:19:00Z',
    annotationStatus: 'completed',
    currentLabels: ['Customer support issue'],
    notes: 'Customer wanted refund after event date moved; handled by support.',
    confidence: 'medium',
    reviewed: true,
    escalatedToCompliance: false,
  },
]

export const supportConversations: SupportConversation[] = [
  {
    conversationId: 'conv_2001',
    customerId: 'cus_2440',
    merchantName: 'Quantum Gadgets',
    channel: 'chat',
    sentiment: 'urgent',
    message: 'My card was charged, but the payment shows failed. Can you fix it today?',
    label: 'Payment failed',
    confidence: 'high',
    status: 'reviewed',
    timestamp: '2026-05-18T09:40:00Z',
  },
  {
    conversationId: 'conv_2002',
    customerId: 'cus_2191',
    merchantName: 'CloudCart Marketplace',
    channel: 'email',
    sentiment: 'frustrated',
    message: 'If this is not refunded I will file a chargeback with my bank.',
    label: 'Chargeback threat',
    confidence: 'high',
    status: 'needs follow-up',
    timestamp: '2026-05-18T09:55:00Z',
  },
  {
    conversationId: 'conv_2003',
    customerId: 'cus_2009',
    merchantName: 'Mint Insurance',
    channel: 'phone transcript',
    sentiment: 'neutral',
    message: 'I need to upload documents before my account verification can be completed.',
    label: 'Account verification issue',
    confidence: 'high',
    status: 'reviewed',
    timestamp: '2026-05-18T10:07:00Z',
  },
  {
    conversationId: 'conv_2004',
    customerId: 'cus_2833',
    merchantName: 'Signal Cloud',
    channel: 'chat',
    sentiment: 'frustrated',
    message: 'Please cancel the subscription and refund the duplicate payment.',
    label: 'Refund request',
    confidence: 'high',
    status: 'reviewed',
    timestamp: '2026-05-18T10:22:00Z',
  },
  {
    conversationId: 'conv_2005',
    customerId: 'cus_2722',
    merchantName: 'Summit Sports',
    channel: 'email',
    sentiment: 'urgent',
    message: 'This looks like fraud. I did not authorize this order and need an investigation.',
    label: 'Suspected fraud',
    confidence: 'high',
    status: 'needs follow-up',
    timestamp: '2026-05-18T10:35:00Z',
  },
  {
    conversationId: 'conv_2006',
    customerId: 'cus_2878',
    merchantName: 'Pulse Tickets',
    channel: 'chat',
    sentiment: 'neutral',
    message: 'I am confused by the billing date shown in the receipt and payment timeline.',
    label: 'Customer confusion',
    confidence: 'medium',
    status: 'reviewed',
    timestamp: '2026-05-18T10:47:00Z',
  },
  {
    conversationId: 'conv_2007',
    customerId: 'cus_2991',
    merchantName: 'BlueWave Electronics',
    channel: 'email',
    sentiment: 'frustrated',
    message: 'Your checkout flow kept declining my card and I am not sure why.',
    label: 'Payment failed',
    confidence: 'medium',
    status: 'open',
    timestamp: '2026-05-18T11:02:00Z',
  },
  {
    conversationId: 'conv_2008',
    customerId: 'cus_2119',
    merchantName: 'FreshHome Goods',
    channel: 'chat',
    sentiment: 'neutral',
    message: 'This merchant charged me twice for the same basket and I need a refund.',
    label: 'Refund request',
    confidence: 'high',
    status: 'reviewed',
    timestamp: '2026-05-18T11:19:00Z',
  },
  {
    conversationId: 'conv_2009',
    customerId: 'cus_2777',
    merchantName: 'SwiftRide',
    channel: 'phone transcript',
    sentiment: 'urgent',
    message: 'I am reporting a suspicious login and want my payment method removed.',
    label: 'Suspected fraud',
    confidence: 'medium',
    status: 'needs follow-up',
    timestamp: '2026-05-18T11:43:00Z',
  },
  {
    conversationId: 'conv_2010',
    customerId: 'cus_2997',
    merchantName: 'Nimbus Market',
    channel: 'chat',
    sentiment: 'neutral',
    message: 'The merchant charged the wrong amount and the app keeps asking me to verify again.',
    label: 'Merchant complaint',
    confidence: 'high',
    status: 'reviewed',
    timestamp: '2026-05-18T12:06:00Z',
  },
]

export const reviewQueue: ReviewItem[] = [
  {
    id: 'rev_1',
    transactionId: 'txn_1002',
    label: 'Chargeback',
    confidence: 'medium',
    assignedReviewer: 'A. Patel',
    status: 'pending',
    notes: 'Needs second-pass review for dispute evidence and customer device history.',
  },
  {
    id: 'rev_2',
    transactionId: 'txn_1006',
    label: 'Fraud',
    confidence: 'high',
    assignedReviewer: 'M. Chen',
    status: 'approved',
    notes: 'Confirmed risk pattern with multiple failed auth attempts and address mismatch.',
  },
  {
    id: 'rev_3',
    transactionId: 'txn_1009',
    label: 'AML review',
    confidence: 'medium',
    assignedReviewer: 'S. Gomez',
    status: 'pending',
    notes: 'Cross-border amount and merchant risk score exceed standard threshold.',
  },
  {
    id: 'rev_4',
    transactionId: 'txn_1011',
    label: 'Failed payment',
    confidence: 'low',
    assignedReviewer: 'R. Singh',
    status: 'rejected',
    notes: 'Decline was issuer-generated, not a platform failure.',
  },
  {
    id: 'rev_5',
    transactionId: 'txn_1014',
    label: 'KYC issue',
    confidence: 'medium',
    assignedReviewer: 'A. Patel',
    status: 'pending',
    notes: 'Waiting on identity verification artifacts before releasing billing changes.',
  },
]

export const activityFeed: ActivityItem[] = [
  {
    id: 'act_1',
    action: 'Saved annotation',
    detail: 'txn_1006 marked Fraud and escalated to compliance',
    timestamp: '2 minutes ago',
  },
  {
    id: 'act_2',
    action: 'Reviewer approved',
    detail: 'rev_2 closed after evidence review',
    timestamp: '11 minutes ago',
  },
  {
    id: 'act_3',
    action: 'Conversation labelled',
    detail: 'conv_2005 tagged as Suspected fraud',
    timestamp: '24 minutes ago',
  },
  {
    id: 'act_4',
    action: 'Export generated',
    detail: '93 synthetic records prepared for model training',
    timestamp: '1 hour ago',
  },
]

export const labelBreakdown = [
  { label: 'Fraud', count: 6 },
  { label: 'Chargeback', count: 4 },
  { label: 'Failed payment', count: 3 },
  { label: 'Refund request', count: 4 },
  { label: 'AML review', count: 2 },
  { label: 'Customer support', count: 5 },
]

export const summaryCards = [
  { label: 'Total transactions reviewed', value: '1,284' },
  { label: 'Pending annotations', value: '42' },
  { label: 'Fraud flagged', value: '86' },
  { label: 'Chargebacks labelled', value: '31' },
  { label: 'Failed payments', value: '58' },
  { label: 'High-risk merchants', value: '14' },
]

export function getTransactionById(transactionId: string) {
  return transactions.find((transaction) => transaction.transactionId === transactionId)
}

export function buildExportRows(
  sourceTransactions: TransactionRecord[] = transactions,
) {
  return sourceTransactions.map((transaction) => ({
    transactionId: transaction.transactionId,
    customerId: transaction.customerId,
    merchantName: transaction.merchantName,
    amount: transaction.amount,
    currency: transaction.currency,
    paymentMethod: transaction.paymentMethod,
    status: transaction.status,
    riskScore: transaction.riskScore,
    country: transaction.country,
    timestamp: transaction.timestamp,
    selectedLabels: transaction.currentLabels,
    annotatorNotes: transaction.notes,
    confidence: transaction.confidence,
    reviewStatus: transaction.reviewed
      ? transaction.escalatedToCompliance
        ? 'escalated'
        : 'approved'
      : 'pending',
    createdAt: transaction.timestamp,
  }))
}

export function getMaskedPaymentDescriptor(transaction: TransactionRecord) {
  switch (transaction.paymentMethod) {
    case 'card':
      return 'card ending 4242'
    case 'bank transfer':
      return 'bank transfer account ending 1098'
    case 'wallet':
      return 'wallet token ending 7741'
    default:
      return transaction.paymentMethod
  }
}
