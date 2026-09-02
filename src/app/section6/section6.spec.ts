import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Section6 } from './section6';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('Section6', () => {
  let component: Section6;
  let fixture: ComponentFixture<Section6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section6],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section6);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
