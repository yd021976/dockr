import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldActionComponent } from './field-action.component';

describe('FieldActionComponent', () => {
  let component: FieldActionComponent;
  let fixture: ComponentFixture<FieldActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
