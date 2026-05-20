import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayLabel AI",
  description:
    "Payments data annotation platform for fraud, disputes, compliance, and AI training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    ["Home", "/"],
    ["Transactions", "/transactions"],
    ["Support", "/support"],
    ["Review", "/review"],
    ["Export", "/export"],
  ];

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_100%)] text-slate-900">
        <div className="grid min-h-screen bg-white lg:grid-cols-[230px_1fr]">
            <aside className="hidden border-r border-sky-100 bg-sky-50 p-5 lg:block">
              <div className="flex h-full flex-col">
                <Link href="/" className="block">
                  <span>
                    <span className="block text-lg font-semibold text-slate-950">
                      PayLabel
                    </span>
                    <span className="block text-xs font-medium text-sky-700">
                      Risk operations
                    </span>
                  </span>
                </Link>

                <nav className="mt-16 space-y-2">
                  {navItems.map(([label, href], index) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-sky-800 hover:shadow-sm"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded bg-white text-xs text-sky-700 ring-1 ring-sky-100">
                        {index + 1}
                      </span>
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto rounded-md bg-white p-4 ring-1 ring-sky-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                    Workspace
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    Synthetic payments
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-900/55">
                    Fraud, disputes, compliance, and AI labelling.
                  </p>
                </div>
              </div>
            </aside>

            <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
              {children}
            </main>
        </div>
      </body>
    </html>
  );
}
