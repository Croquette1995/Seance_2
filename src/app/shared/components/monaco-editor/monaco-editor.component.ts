import { 
  Component, 
  ElementRef, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  AfterViewInit, 
  OnDestroy, 
  OnChanges, 
  SimpleChanges,
  inject,
  effect,
  signal,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { MonacoLoaderService } from '../../../core/services/monaco-loader.service';

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  template: `
    <div class="monaco-wrapper">
      @if (isLoading()) {
        <div class="monaco-loading">
          <div class="spinner"></div>
          <span>Chargement de Monaco Editor...</span>
        </div>
      }
      <div #editorContainer class="editor-container"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .monaco-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 250px;
      background: var(--bg-code, #0b0f19);
      border-radius: 6px;
      overflow: hidden;
    }
    .editor-container {
      width: 100%;
      height: 100%;
    }
    .monaco-loading {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgba(11, 15, 25, 0.85);
      color: #94a3b8;
      font-size: 0.85rem;
      z-index: 10;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(49, 120, 198, 0.2);
      border-top-color: #3178c6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class MonacoEditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() code: string = '';
  @Input() language: string = 'typescript';
  @Input() readOnly: boolean = false;
  @Output() codeChange = new EventEmitter<string>();

  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;

  private readonly themeService = inject(ThemeService);
  private readonly monacoLoader = inject(MonacoLoaderService);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  private editor: any = null;
  private monacoInstance: any = null;
  private resizeObserver: ResizeObserver | null = null;

  readonly isLoading = signal<boolean>(true);

  constructor() {
    effect(() => {
      const theme = this.themeService.theme();
      if (this.monacoInstance) {
        this.monacoInstance.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      this.monacoInstance = await this.monacoLoader.init();

      this.ngZone.run(() => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      });

      this.initEditor();
    } catch (err) {
      console.error('[MonacoEditor] Erreur chargement éditeur :', err);
      this.ngZone.run(() => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      });
    }
  }

  private initEditor(): void {
    if (!this.editorContainer?.nativeElement || !this.monacoInstance) return;

    this.editor = this.monacoInstance.editor.create(this.editorContainer.nativeElement, {
      value: this.code,
      language: this.language,
      theme: this.themeService.theme() === 'dark' ? 'vs-dark' : 'vs',
      readOnly: this.readOnly,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: "'Fira Code', 'Cascadia Code', Menlo, Consolas, monospace",
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      tabSize: 2,
      renderLineHighlight: 'all',
      padding: { top: 12, bottom: 12 }
    });

    this.editor.onDidChangeModelContent(() => {
      const value = this.editor.getValue();
      if (value !== this.code) {
        this.code = value;
        this.ngZone.run(() => {
          this.codeChange.emit(value);
        });
      }
    });

    this.editor.layout();
    setTimeout(() => {
      if (this.editor) {
        this.editor.layout();
      }
    }, 60);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.editor) {
          this.editor.layout();
        }
      });
      this.resizeObserver.observe(this.editorContainer.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editor && changes['code'] && !changes['code'].isFirstChange()) {
      if (this.editor.getValue() !== this.code) {
        this.editor.setValue(this.code);
      }
    }

    if (this.editor && changes['language'] && !changes['language'].isFirstChange() && this.monacoInstance) {
      const model = this.editor.getModel();
      if (model) {
        this.monacoInstance.editor.setModelLanguage(model, this.language);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }
}
