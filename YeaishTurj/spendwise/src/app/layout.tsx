import "./globals.css";

export const metadata = {
  title: "SpendWise",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col">
          {/* NAVBAR */}
          <header className="border-b">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="font-bold text-lg">SpendWise</h1>

              <div className="flex gap-3 items-center">
                <a href="/dashboard" className="text-sm">
                  Dashboard
                </a>
                <a href="/dashboard/add" className="text-sm">
                  Add Expense
                </a>
              </div>
            </div>
          </header>

          {/* PAGE */}
          <main className="max-w-6xl mx-auto w-full flex-1 px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
