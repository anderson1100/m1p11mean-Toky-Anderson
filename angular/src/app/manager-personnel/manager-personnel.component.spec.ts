import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPersonnelComponent } from './manager-personnel.component';

describe('ManagerPersonnelComponent', () => {
  let component: ManagerPersonnelComponent;
  let fixture: ComponentFixture<ManagerPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPersonnelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
