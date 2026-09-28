import { Injectable, NgZone, inject } from '@angular/core';
import loader from '@monaco-editor/loader';

@Injectable({
  providedIn: 'root'
})
export class MonacoLoaderService {
  private readonly ngZone = inject(NgZone);
  private monacoPromise: Promise<any> | null = null;
  private monacoInstance: any = null;

  /**
   * Initialise et met en cache l'instance globale de Monaco Editor.
   * Configure le compilateur TypeScript en mode strict pour afficher les diagnostics.
   */
  init(): Promise<any> {
    if (this.monacoInstance) {
      return Promise.resolve(this.monacoInstance);
    }

    if (this.monacoPromise) {
      return this.monacoPromise;
    }

    const baseVsPath = typeof window !== 'undefined'
      ? `${window.location.origin}/assets/monaco/vs`
      : '/assets/monaco/vs';

    loader.config({
      paths: {
        vs: baseVsPath
      }
    });

    this.monacoPromise = new Promise((resolve, reject) => {
      loader.init()
        .then((monaco) => {
          this.monacoInstance = monaco;
          this.configureTypescriptWorker(monaco);
          this.ngZone.run(() => {
            resolve(monaco);
          });
        })
        .catch((err) => {
          console.warn('[MonacoLoader] Échec chargement local, repli CDN jsDelivr...', err);
          loader.config({
            paths: {
              vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs'
            }
          });

          loader.init()
            .then((monaco) => {
              this.monacoInstance = monaco;
              this.configureTypescriptWorker(monaco);
              this.ngZone.run(() => {
                resolve(monaco);
              });
            })
            .catch((cdnErr) => {
              console.error('[MonacoLoader] Échec critique Monaco Editor :', cdnErr);
              this.monacoPromise = null;
              this.ngZone.run(() => {
                reject(cdnErr);
              });
            });
        });
    });

    return this.monacoPromise;
  }

  private configureTypescriptWorker(monaco: any): void {
    try {
      if (monaco?.languages?.typescript) {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2022,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: false
        });
      }
    } catch {
      // Ignorer si déjà configuré
    }
  }
}
