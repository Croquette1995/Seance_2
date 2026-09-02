import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Section1 } from './section1';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('Section1', () => {
  let component: Section1;
  let fixture: ComponentFixture<Section1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section1],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
