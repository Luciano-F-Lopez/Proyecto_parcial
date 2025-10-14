import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaResultado } from './encuesta-resultado';

describe('EncuestaResultado', () => {
  let component: EncuestaResultado;
  let fixture: ComponentFixture<EncuestaResultado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuestaResultado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaResultado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
