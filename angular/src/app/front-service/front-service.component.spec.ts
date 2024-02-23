import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontServiceComponent } from './front-service.component';

describe('FrontServiceComponent', () => {
  let component: FrontServiceComponent;
  let fixture: ComponentFixture<FrontServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
