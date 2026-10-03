import { Injectable, NgZone, inject } from '@angular/core';
import loader from '@monaco-editor/loader';

@Injectable({
  providedIn: 'root'
})
export class MonacoLoaderService {
  private readonly ngZone = inject(NgZone);
  private monacoPromise: Promise<any> | null = null;
  private monacoInstance: any = null;

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
          this.ngZone.run(() => resolve(monaco));
        })
        .catch((err) => {
          console.warn('[MonacoLoader] Échec chargement local, bascule vers CDN jsDelivr...', err);
          loader.config({
            paths: {
              vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
            }
          });

          loader.init()
            .then((monaco) => {
              this.monacoInstance = monaco;
              this.ngZone.run(() => resolve(monaco));
            })
            .catch((cdnErr) => {
              console.error('[MonacoLoader] Impossible d\'initialiser Monaco :', cdnErr);
              this.monacoPromise = null;
              this.ngZone.run(() => reject(cdnErr));
            });
        });
    });

    return this.monacoPromise;
  }
}
