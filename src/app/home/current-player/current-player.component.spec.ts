import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlayerComponent } from './current-player.component';

describe('CurrentPlayerComponent', () => {
  let component: CurrentPlayerComponent;
  let fixture: ComponentFixture<CurrentPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
