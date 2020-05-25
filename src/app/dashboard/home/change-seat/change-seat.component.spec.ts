import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSeatComponent } from './change-seat.component';

describe('ChangeSeatComponent', () => {
  let component: ChangeSeatComponent;
  let fixture: ComponentFixture<ChangeSeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
