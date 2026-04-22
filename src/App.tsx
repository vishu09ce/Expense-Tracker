/**
 * App.tsx — Root component.
 *
 * Responsibility: compose the top-level layout (navigation, main content area).
 * All feature routing and state will be wired here in later phases.
 * Keeping this file thin ensures the root stays readable as the app grows (SRP).
 */

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar — rendered in Phase 3 */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-text-primary">Expense Tracker</h1>
        </div>
      </header>

      {/* Main content area — feature components mount here */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <p className="text-text-secondary">Phase 1 scaffold — app is running.</p>
      </main>
    </div>
  );
}

export default App;
