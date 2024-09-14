import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefInfiniteScrollComponent } from './ref-infinite-scroll.component';

describe('RefInfiniteScrollComponent', () => {
  let component: RefInfiniteScrollComponent;
  let fixture: ComponentFixture<RefInfiniteScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefInfiniteScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefInfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
