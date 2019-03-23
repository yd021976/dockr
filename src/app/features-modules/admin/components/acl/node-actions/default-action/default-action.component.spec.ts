import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultActionComponent } from './default-action.component';

describe('DefaultActionComponent', () => {
  let component: DefaultActionComponent;
  let fixture: ComponentFixture<DefaultActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
