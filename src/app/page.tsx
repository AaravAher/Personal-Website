
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a
            href="#"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            Aarav Aher
          </a>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for projects
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block rounded-lg bg-zinc-200/60 px-3 py-1 text-xs font-mono uppercase tracking-wider text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
            Personal Website & Portfolio
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:leading-tight">
            Hi, I&apos;m Aarav.
          </h1>

          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Welcome to my corner of the web. Ready to build something remarkable.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-zinc-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} Aarav Aher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
