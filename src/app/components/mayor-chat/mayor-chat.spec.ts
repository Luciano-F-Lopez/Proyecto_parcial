import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorChat } from './mayor-chat';

describe('MayorChat', () => {
  let component: MayorChat;
  let fixture: ComponentFixture<MayorChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MayorChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MayorChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
