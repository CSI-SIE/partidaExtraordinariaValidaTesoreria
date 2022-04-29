import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaDirectorVicerrectorComponent } from './valida-director-vicerrector.component';

describe('ValidaDirectorVicerrectorComponent', () => {
  let component: ValidaDirectorVicerrectorComponent;
  let fixture: ComponentFixture<ValidaDirectorVicerrectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaDirectorVicerrectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaDirectorVicerrectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
