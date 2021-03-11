import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovilAltaComponent } from './movil-alta.component';

describe('MovilAltaComponent', () => {
  let component: MovilAltaComponent;
  let fixture: ComponentFixture<MovilAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovilAltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
