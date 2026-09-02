import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ngx-monaco-editor-v2';

// Declare monaco globally so we can access its TS worker
declare const monaco: any;

@Component({
  selector: 'app-code-editor',
  imports: [FormsModule, EditorComponent],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
  encapsulation: ViewEncapsulation.None
})
export class CodeEditor {
  @Input() set initialCode(value: string) {
    this.code = value;
  }

  code = '';
  editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    automaticLayout: true
  };

  output = signal<string[]>([]);
  error = signal<string | null>(null);

  editorInstance: any;

  onInit(editor: any) {
    this.editorInstance = editor;
  }

  async runCode() {
    this.output.set([]);
    this.error.set(null);

    try {
      if (!this.editorInstance) {
        throw new Error('Editor not initialized');
      }

      // 1. Transpile TS to JS using Monaco's native worker
      const model = this.editorInstance.getModel();
      const worker = await monaco.languages.typescript.getTypeScriptWorker();
      const client = await worker(model.uri);
      const emitOutput = await client.getEmitOutput(model.uri.toString());

      const jsOutputFile = emitOutput.outputFiles.find((o: any) => o.name.endsWith('.js'));
      if (!jsOutputFile) {
         throw new Error('Failed to transpile TypeScript');
      }
      const jsCode = jsOutputFile.text;

      // 2. Capture console.log
      const logs: string[] = [];
      const originalConsoleLog = console.log;

      const customConsole = {
        log: (...args: any[]) => {
          const formatted = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          logs.push(formatted);
          originalConsoleLog.apply(console, args);
        }
      };

      // 3. Execute JS securely-ish
      // We wrap it in an IIFE and pass our custom console
      const execute = new Function('console', `
        ${jsCode}
      `);

      execute(customConsole);
      this.output.set(logs);

    } catch (err: any) {
      this.error.set(err.toString());
    }
  }
}