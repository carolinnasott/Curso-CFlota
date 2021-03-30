import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaOdometroComponent } from './alerta-odometro.component';

describe('AlertaOdometroComponent', () => {
  let component: AlertaOdometroComponent;
  let fixture: ComponentFixture<AlertaOdometroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertaOdometroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaOdometroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
