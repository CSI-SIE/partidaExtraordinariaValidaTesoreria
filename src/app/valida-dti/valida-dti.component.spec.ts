import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaDTIComponent } from './valida-dti.component';

describe('ValidaDTIComponent', () => {
  let component: ValidaDTIComponent;
  let fixture: ComponentFixture<ValidaDTIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaDTIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaDTIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
