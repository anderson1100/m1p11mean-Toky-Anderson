import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontWrapper2Component } from './front-wrapper2.component';

describe('FrontWrapper2Component', () => {
  let component: FrontWrapper2Component;
  let fixture: ComponentFixture<FrontWrapper2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontWrapper2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontWrapper2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
