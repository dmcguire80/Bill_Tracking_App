interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-neutral-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-4 hidden md:flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Linear Budget
          </h1>
          <span className="text-xs text-slate-500 font-mono">
            v{import.meta.env.PACKAGE_VERSION}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
};
