import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionserviceComponent } from './gestionservice.component';

describe('GestionserviceComponent', () => {
  let component: GestionserviceComponent;
  let fixture: ComponentFixture<GestionserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionserviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
