import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontFavorisComponent } from './front-favoris.component';

describe('FrontFavorisComponent', () => {
  let component: FrontFavorisComponent;
  let fixture: ComponentFixture<FrontFavorisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontFavorisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontFavorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
