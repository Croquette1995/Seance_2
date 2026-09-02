import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Section4 } from './section4';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('Section4', () => {
  let component: Section4;
  let fixture: ComponentFixture<Section4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section4],
      providers: [provideMonacoEditor()]
    }).compileComponents();

    fixture = TestBed.createComponent(Section4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
