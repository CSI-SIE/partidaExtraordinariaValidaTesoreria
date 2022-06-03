import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaRectorAdministrativoComponent } from './valida-rector-administrativo.component';

describe('ValidaRectorAdministrativoComponent', () => {
  let component: ValidaRectorAdministrativoComponent;
  let fixture: ComponentFixture<ValidaRectorAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaRectorAdministrativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaRectorAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
