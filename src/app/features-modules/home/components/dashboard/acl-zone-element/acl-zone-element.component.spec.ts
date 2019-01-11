import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclZoneElementComponent } from './acl-zone-element.component';

describe('AclZoneElementComponent', () => {
  let component: AclZoneElementComponent;
  let fixture: ComponentFixture<AclZoneElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclZoneElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclZoneElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
