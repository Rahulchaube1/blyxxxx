const vscode = require("vscode");
const path = require("node:path");
const { Worker } = require("node:worker_threads");

function activate(context) {
  const diagnostics = vscode.languages.createDiagnosticCollection("blyx");
  const output = vscode.window.createOutputChannel("Blyx");
  const pending = new Map();

  function cancel(key) {
    const job = pending.get(key);
    if (job) {
      clearTimeout(job.timer);
      if (job.worker) void job.worker.terminate();
      pending.delete(key);
    }
  }

  function schedule(doc, run = false) {
    if (doc.languageId !== "blyx") return;
    const key = doc.uri.toString();
    cancel(key);
    const version = doc.version;
    const job = {};
    pending.set(key, job);
    job.timer = setTimeout(() => {
      const worker = new Worker(path.join(__dirname, "worker.mjs"), { workerData: { source: doc.getText(), run } });
      job.worker = worker;
      function finish(result) {
        if (pending.get(key) !== job) return;
        cancel(key);
        if (doc.isClosed || doc.version !== version) return;
        diagnostics.set(doc.uri, result.diagnostics.map(d => {
          const line = Math.min(doc.lineCount - 1, Math.max(0, (d.line || 1) - 1));
          const text = doc.lineAt(line).text;
          const column = Array.from(text).slice(0, Math.max(0, (d.column || 1) - 1)).join("").length;
          return new vscode.Diagnostic(new vscode.Range(line, column, line, Math.min(text.length, column + 1)), d.message, vscode.DiagnosticSeverity.Error);
        }));
        if (run) {
          output.clear();
          output.append(result.output);
          for (const d of result.diagnostics) output.appendLine((d.line ? d.line + ":" + d.column + "  " : "") + d.message);
          output.show(true);
        }
      }
      worker.once("message", finish);
      const failed = message => finish({ output: "", diagnostics: [{ message }] });
      worker.once("error", error => failed(error.message));
      worker.once("exit", code => { if (code) failed("Blyx worker exited with code " + code); });
      job.timer = setTimeout(() => failed("Blyx exceeded the 8 second editor limit."), 8000);
    }, run ? 0 : 300);
  }

  context.subscriptions.push(diagnostics, output,
    vscode.workspace.onDidOpenTextDocument(doc => schedule(doc)),
    vscode.workspace.onDidChangeTextDocument(e => schedule(e.document)),
    vscode.workspace.onDidCloseTextDocument(doc => { cancel(doc.uri.toString()); diagnostics.delete(doc.uri); }),
    vscode.commands.registerCommand("blyx.run", () => {
      const doc = vscode.window.activeTextEditor?.document;
      if (doc?.languageId === "blyx") schedule(doc, true);
      else vscode.window.showInformationMessage("Open a Blyx program to run it.");
    }),
    { dispose() { for (const key of pending.keys()) cancel(key); } }
  );
  for (const doc of vscode.workspace.textDocuments) schedule(doc);
}
module.exports = { activate };
