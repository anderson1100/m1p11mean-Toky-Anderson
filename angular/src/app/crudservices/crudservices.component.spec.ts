import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudservicesComponent } from './crudservices.component';

describe('CrudservicesComponent', () => {
  let component: CrudservicesComponent;
  let fixture: ComponentFixture<CrudservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudservicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
