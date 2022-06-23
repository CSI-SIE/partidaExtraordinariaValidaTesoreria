import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionSieComponent } from './sesion-sie.component';

describe('SesionSieComponent', () => {
  let component: SesionSieComponent;
  let fixture: ComponentFixture<SesionSieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionSieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionSieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
