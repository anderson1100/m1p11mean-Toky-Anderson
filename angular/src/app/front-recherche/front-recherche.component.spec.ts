import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontRechercheComponent } from './front-recherche.component';

describe('FrontRechercheComponent', () => {
  let component: FrontRechercheComponent;
  let fixture: ComponentFixture<FrontRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontRechercheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
