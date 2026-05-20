# PayLabel AI

PayLabel AI is the standalone fintech portfolio project in `paylabel-ai/`. It
reframes a data annotation tool into a payments-focused review platform for
fraud, disputes, compliance, and AI training workflows.

## Project Overview

The app simulates how payment teams label synthetic transaction data, review
chargebacks, inspect risky merchant activity, and classify customer support
conversations. It is designed as a clean, portfolio-ready demo that mirrors the
workflows used by fintech risk, fraud, compliance, and machine learning teams.

## Problem It Solves

Payment businesses need fast ways to review noisy operational data and turn it
into structured training labels. Analysts often need to:

- identify suspicious transactions,
- separate fraud from false positives,
- triage disputes and chargebacks,
- flag compliance and KYC/AML issues,
- and label support conversations for model training and evaluation.

PayLabel AI demonstrates that workflow in a synthetic, local-only Next.js app.

## Fintech / Payment Use Case

This project is tailored to payment operations and risk teams that work with
transaction monitoring, dispute handling, and customer support review. It can
serve as a portfolio example for:

- fraud operations tooling,
- compliance review tooling,
- chargeback analysis,
- payment support classification,
- and AI dataset labeling for payment risk models.

## Features

- Dashboard with summary cards, an activity feed, and label breakdown charts.
- Transaction annotation queue with 20+ synthetic payment events.
- Transaction detail pages for labeling, notes, confidence, review, and
  compliance escalation.
- Support conversation labelling with 10 synthetic conversations.
- Human review queue for high-risk and low-confidence annotations.
- JSON and CSV export for labelled data.
- Fintech-style navigation and product copy throughout the UI.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Screenshots

Add screenshots of the dashboard, transaction detail page, support labelling
view, review queue, and export screen here.

## Security / Compliance Note

This project uses synthetic mock data only. No real cardholder data, PAN, CVV,
or authentication data is stored or displayed. The UI is intentionally shaped
to reflect PCI-aware workflows while following the principle that real payment
data should be protected under PCI DSS and broader security controls.

## Future Improvements

- Role-based access
- Audit logs
- Integration with payment processors
- Model feedback loop
- Active learning for annotation prioritisation
- Compliance reporting dashboard

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the app.
