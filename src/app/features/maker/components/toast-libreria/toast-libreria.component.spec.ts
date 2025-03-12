import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastLibreriaComponent } from './toast-libreria.component';

describe('ToastLibreriaComponent', () => {
  let component: ToastLibreriaComponent;
  let fixture: ComponentFixture<ToastLibreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastLibreriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastLibreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
