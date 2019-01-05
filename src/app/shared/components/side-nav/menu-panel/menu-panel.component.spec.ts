import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPanelComponent } from './menu-panel.component';
import { AppRoute } from 'src/app/shared/models/app-route.model';
import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


// Just a dummy component for routes definition
@Component({
  template: ''
})
class DummyComponent {
}

// Test route config
const routes: AppRoute[] = [
  {
    path: 'test-2',
    data: { isMenu: true, title: 'test-2' },
    children: [
      {
        path: 'submenu-2', component: null,
        data: { isMenu: true, link: 'test-2/submenu-2', title: 'menu test #2' }
      }
    ]
  },
  {}
]

describe('MenuPanelComponent', () => {
  let component: MenuPanelComponent;
  let fixture: ComponentFixture<MenuPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuPanelComponent, DummyComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#1 Should create', () => {
    expect(component).toBeTruthy();
  });

  it('#2 Should display a menu panel with menu link', async(() => {
    component.menuItem = routes[0]
    fixture.detectChanges()
    let span_debugElement: DebugElement = fixture.debugElement.query(By.css('.header-title-description'))
    fixture.whenStable().then(() => {
      expect(span_debugElement.nativeElement.innerText).toEqual('test-2')
      let menuLink_debugElement: DebugElement = fixture.debugElement.query(By.css('app-menu-link'))
      expect(menuLink_debugElement).toBeTruthy()
    })
  }))
  it('#3 Should display nothing if menuItem is empty', async(() => {
    component.menuItem = routes[1]
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      let empty_debugElement: DebugElement = fixture.debugElement.query(By.css('mat-expansion-panel'))
      expect(empty_debugElement).toBeNull()
    })
  }))
});
