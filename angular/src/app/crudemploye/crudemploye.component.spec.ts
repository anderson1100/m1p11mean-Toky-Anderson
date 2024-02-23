import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudemployeComponent } from './crudemploye.component';

describe('CrudemployeComponent', () => {
  let component: CrudemployeComponent;
  let fixture: ComponentFixture<CrudemployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudemployeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudemployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
