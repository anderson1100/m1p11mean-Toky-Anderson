import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontWrapper1Component } from './front-wrapper1.component';

describe('FrontWrapper1Component', () => {
  let component: FrontWrapper1Component;
  let fixture: ComponentFixture<FrontWrapper1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontWrapper1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontWrapper1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
