import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontEmployeComponent } from './front-employe.component';

describe('FrontEmployeComponent', () => {
  let component: FrontEmployeComponent;
  let fixture: ComponentFixture<FrontEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontEmployeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
