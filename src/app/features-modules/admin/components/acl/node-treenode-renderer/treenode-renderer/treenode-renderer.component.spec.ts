import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreenodeRendererComponent } from './treenode-renderer.component';

describe('TreenodeRendererComponent', () => {
  let component: TreenodeRendererComponent;
  let fixture: ComponentFixture<TreenodeRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreenodeRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreenodeRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
