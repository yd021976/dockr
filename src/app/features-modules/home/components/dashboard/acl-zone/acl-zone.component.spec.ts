import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclZoneComponent } from './acl-zone.component';

describe('AclZoneComponent', () => {
  let component: AclZoneComponent;
  let fixture: ComponentFixture<AclZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
