import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSearchClientComponent } from './simple-search-client.component';

describe('SimpleSearchClientComponent', () => {
  let component: SimpleSearchClientComponent;
  let fixture: ComponentFixture<SimpleSearchClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleSearchClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
