import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostoFinalComponent } from './costo-final.component';

describe('CostoFinalComponent', () => {
  let component: CostoFinalComponent;
  let fixture: ComponentFixture<CostoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostoFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostoFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
