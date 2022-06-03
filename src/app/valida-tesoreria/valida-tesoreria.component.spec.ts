import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaTesoreriaComponent } from './valida-tesoreria.component';

describe('ValidaTesoreriaComponent', () => {
  let component: ValidaTesoreriaComponent;
  let fixture: ComponentFixture<ValidaTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
