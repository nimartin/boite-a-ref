import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefPlayerComponent } from './ref-player.component';

describe('RefPlayerComponent', () => {
  let component: RefPlayerComponent;
  let fixture: ComponentFixture<RefPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
