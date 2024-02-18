import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontHistoriqueComponent } from './front-historique.component';

describe('FrontHistoriqueComponent', () => {
  let component: FrontHistoriqueComponent;
  let fixture: ComponentFixture<FrontHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontHistoriqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
