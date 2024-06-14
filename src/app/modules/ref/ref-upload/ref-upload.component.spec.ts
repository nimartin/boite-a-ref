import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefUploadComponent } from './ref-upload.component';

describe('RefUploadComponent', () => {
  let component: RefUploadComponent;
  let fixture: ComponentFixture<RefUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
