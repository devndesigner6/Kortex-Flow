export function SetupInstructions() {
  return (
    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-6">
      <h3 className="mb-4 font-mono text-lg text-yellow-500">&gt; DATABASE_SETUP_REQUIRED</h3>
      <div className="space-y-4 font-mono text-sm text-yellow-500/70">
        <p>To use KortexFlow, you need to set up the database first:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            Click the "Run Script" button next to <code className="text-yellow-500">scripts/001_create_schema.sql</code>
          </li>
          <li>Wait for the script to complete</li>
          <li>Refresh this page</li>
        </ol>
        <p className="text-yellow-500">This will create all necessary tables and security policies.</p>
      </div>
    </div>
  )
}
