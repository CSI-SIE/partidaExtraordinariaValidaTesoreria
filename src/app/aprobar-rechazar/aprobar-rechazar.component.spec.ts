import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarRechazarComponent } from './aprobar-rechazar.component';

describe('AprobarRechazarComponent', () => {
  let component: AprobarRechazarComponent;
  let fixture: ComponentFixture<AprobarRechazarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarRechazarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarRechazarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
