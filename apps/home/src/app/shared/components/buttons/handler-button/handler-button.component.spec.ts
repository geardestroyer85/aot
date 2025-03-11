import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlerButtonComponent } from './handler-button.component';

describe('HandlerButtonComponent', () => {
  let component: HandlerButtonComponent;
  let fixture: ComponentFixture<HandlerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandlerButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandlerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
