import { async, ComponentFixture, TestBed, fakeAsync, inject } from '@angular/core/testing';

import { MenuLinkComponent } from './menu-link.component';
import { NO_ERRORS_SCHEMA, DebugElement, Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing'
import { By } from '@angular/platform-browser';
import { AppRoute } from 'src/app/shared/models/app-route.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  template: ''
})
class DummyComponent {
}


describe('MenuLinkComponent', () => {
  let component: MenuLinkComponent;
  let fixture: ComponentFixture<MenuLinkComponent>;

  const routes: AppRoute[] = [
    {
      path: 'test2', component: DummyComponent,
      data: { isMenu: true, link: 'test2', title: 'menu test' }
    },
    {
      path: 'test3', redirectTo: 'test3',
      data: { isMenu: false, link: 'test3', title: 'menu test' }
    },
    {
      path: 'test4',
      data: { isMenu: false, link: 'test4', title: 'menu test' },
      children: [{
        path: 'child_test_4', redirectTo: '/',
        data: {
          isMenu: true, title: 'Child menu item'
        }
      }]
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [MenuLinkComponent, DummyComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#1 should create', () => {
    expect(component).toBeTruthy();
  });

  it('#2 should display the menu item with correct link', fakeAsync(() => {
    component.menuItem = routes[0]
    fixture.detectChanges()
    let de = fixture.debugElement
    let span_debugElement = de.query(By.css('a>span'))
    let span_htmlElement: HTMLSpanElement = span_debugElement.nativeElement
    let content = span_htmlElement.innerHTML
    expect(content).toEqual('menu test')

    let link_debugElement: DebugElement = de.query(By.css('a'))
    let link_htmlElement: HTMLAnchorElement = link_debugElement.nativeElement
    let link_content = link_htmlElement.pathname
    expect(link_content).toEqual('/test2')

  }))
  it('#3 should not display menu item', fakeAsync(() => {
    component.menuItem = routes[1]
    fixture.detectChanges()
    let de = fixture.debugElement
    let link_De = de.query(By.css('a>span'))
    expect(link_De).toBeNull()
  }))
  it('#4 should display menu panel for child menu item', fakeAsync(() => {
    component.menuItem = routes[2]
    fixture.detectChanges()
    let de = fixture.debugElement
    let menuPanelComp = de.query(By.css('app-menu-panel'))
    expect(menuPanelComp).toBeTruthy()
  }))
  it('#5 should navigate to url', async(
    inject([Router, Location], (router: Router, location: Location) => {
      component.menuItem = routes[0]
      fixture.detectChanges()
      let de: DebugElement = fixture.debugElement
      let link_debugElement: DebugElement = de.query(By.css('a'))
      let link_nativeElement: HTMLAnchorElement = link_debugElement.nativeElement

      // Navigate
      link_nativeElement.click()
      fixture.whenStable().then(() => {
        let icon_debugElement = link_debugElement.query(By.css('mat-icon'))
        expect(location.path()).toEqual('/test2') // new location should be "test2"
        expect(link_debugElement.classes['linkActive']).toBeTruthy() // The anchor class should be sets as route is active
        expect(icon_debugElement.properties['fontIcon']).toEqual('fa-angle-right') // Icon must be 'fa-angle-right' as linkActive is set
      })
    })))
});
