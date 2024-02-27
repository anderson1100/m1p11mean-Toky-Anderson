import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontOffreSpecialesComponent } from './front-offre-speciales.component';

describe('FrontOffreSpecialesComponent', () => {
  let component: FrontOffreSpecialesComponent;
  let fixture: ComponentFixture<FrontOffreSpecialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOffreSpecialesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontOffreSpecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
