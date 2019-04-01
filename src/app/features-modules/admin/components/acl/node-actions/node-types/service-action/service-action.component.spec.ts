import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceActionComponent } from './service-action.component';

describe('ServiceActionComponent', () => {
  let component: ServiceActionComponent;
  let fixture: ComponentFixture<ServiceActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
