import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeEditor } from './code-editor';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('CodeEditor', () => {
  let component: CodeEditor;
  let fixture: ComponentFixture<CodeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditor],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
