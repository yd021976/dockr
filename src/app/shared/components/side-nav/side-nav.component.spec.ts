import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRouteInterface } from 'src/app/shared/models/application.route.model';
import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SideNavComponent } from './side-nav.component'

// Just a dummy component for routes definition
@Component({
    template: ''
})
class DummyComponent {
}

// Test route config
const routesConfigs: ApplicationRouteInterface[][] = [
    // Test route for test #2
    [
        {
            path: 'test-2',
            data: { isMenu: true, title: 'test-2' },
            children: [
                {
                    path: 'submenu-2-1', component: DummyComponent,
                    data: { isMenu: true, link: 'test-2/submenu-2-1', title: 'sub menu 1 for test #2' }
                },
                {
                    path: 'submenu-2-2', component: DummyComponent,
                    data: { isMenu: true, link: 'test-2/submenu-2-1', title: 'sub menu 2 for test #2' }
                }
            ]
        }
    ],
    // Test route for test #3
    [
        {
            path: 'test-3-1',
            data: { isMenu: true, title: 'test-3' },
            children: [
                {
                    path: 'submenu-3-1-1', component: DummyComponent,
                    data: { isMenu: true, link: 'test-3/submenu-3-1-1', title: 'submenu-3-1-1 for test #3' }
                },
                {
                    path: 'submenu-3-1-2', component: DummyComponent,
                    data: { isMenu: true, link: 'test-3/submenu-3-1-2', title: 'submenu-3-1-2 for test #3' }
                }
            ]
        },
        {
            path: 'test-3-2',
            data: { isMenu: true, title: 'test-3' },
            children: [
                {
                    path: 'submenu-3-2-1', component: DummyComponent,
                    data: { isMenu: true, link: 'test-3/submenu-3-2-1', title: 'submenu-3-2-1 test #3' }
                },
                {
                    path: 'submenu-3-2-2', component: DummyComponent,
                    data: { isMenu: true, link: 'test-2/submenu-3-2-2', title: 'submenu-3-2-2 for test #2' }
                }
            ]
        },
    ],
    // Test route for test #4
    [
        {
            path: 'test-4', component: DummyComponent,
            data: { isMenu: true, title: 'test-4' }
        }
    ]
]

describe('SidenavComponent', () => {
    let component: SideNavComponent;
    let fixture: ComponentFixture<SideNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SideNavComponent, DummyComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SideNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('#1 Should create', () => {
        expect(component).toBeTruthy();
    });

    it('#2 Should create one menu panel and zero menu link element', async(() => {
        component.routerConfig = routesConfigs[0]
        fixture.detectChanges()
        let menuPanel_debugElement: DebugElement = fixture.debugElement.query(By.css('app-menu-panel'))
        let menuLink_debugElement: DebugElement = fixture.debugElement.query(By.css('app-menu-link'))
        fixture.whenStable().then(() => {
            expect(menuPanel_debugElement instanceof Array).toBeFalsy()
            expect(menuPanel_debugElement).toBeTruthy()
            expect(menuLink_debugElement).toBeNull()
        })
    }))
    it('#3 Should create two menu panel and zero menu link element', async(() => {
        component.routerConfig = routesConfigs[1]
        fixture.detectChanges()
        fixture.whenStable().then(() => {
            let menuPanel_debugElement: DebugElement[] = fixture.debugElement.queryAll(By.css('app-menu-panel'))
            let menuLink_debugElement: DebugElement = fixture.debugElement.query(By.css('app-menu-link'))
            expect(menuPanel_debugElement.length).toEqual(2)
            expect(menuLink_debugElement).toBeFalsy()
        })
    }))
    it('#4 Should create one menu link element and zero menu panel element', async(() => {
        component.routerConfig = routesConfigs[2]
        fixture.detectChanges()
        fixture.whenStable().then(() => {
            let menuPanel_debugElement: DebugElement[] = fixture.debugElement.queryAll(By.css('app-menu-panel'))
            let menuLink_debugElement: DebugElement[] = fixture.debugElement.queryAll(By.css('app-menu-link'))
            expect(menuPanel_debugElement.length).toEqual(0)
            expect(menuLink_debugElement.length).toEqual(1)
        })
    }))
});
