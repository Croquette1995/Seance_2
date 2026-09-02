import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Section2 } from './section2';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('Section2', () => {
  let component: Section2;
  let fixture: ComponentFixture<Section2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section2],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
