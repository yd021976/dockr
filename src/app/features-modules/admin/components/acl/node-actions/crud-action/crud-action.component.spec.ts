import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudActionComponent } from './crud-action.component';

describe('CrudActionComponent', () => {
  let component: CrudActionComponent;
  let fixture: ComponentFixture<CrudActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
