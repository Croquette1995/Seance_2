import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Section3 } from './section3';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('Section3', () => {
  let component: Section3;
  let fixture: ComponentFixture<Section3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section3],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
