import { TestBed } from '@angular/core/testing';

import { Preguntas } from './preguntas';

describe('Preguntas', () => {
  let service: Preguntas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Preguntas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
