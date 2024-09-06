import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefTutoComponent } from './ref-tuto.component';

describe('RefTutoComponent', () => {
  let component: RefTutoComponent;
  let fixture: ComponentFixture<RefTutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefTutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefTutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
