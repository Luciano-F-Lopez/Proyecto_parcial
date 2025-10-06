import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackJack } from './black-jack';

describe('BlackJack', () => {
  let component: BlackJack;
  let fixture: ComponentFixture<BlackJack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackJack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackJack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
