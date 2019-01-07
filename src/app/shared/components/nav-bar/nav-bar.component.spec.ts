import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavBarComponent } from './nav-bar.component';
import { MatMenuModule } from '@angular/material';
import { ThemeItem } from '../../models/theme-items.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


const themeItems: ThemeItem[] = [
    {
        class_name: 'Theme 1', name: 'test 1'
    },
    {
        class_name: 'Theme 2', name: 'test 2'
    }
]
describe('NavBarComponent', () => {
    let fixture: ComponentFixture<NavBarComponent>
    let component: NavBarComponent

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatMenuModule, NoopAnimationsModule],
            declarations: [NavBarComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('#1 Should create component', () => {
        expect(component).toBeTruthy()
    })

    describe('Login button tests', () => {
        it('#2 Should enable login button', async(() => {
            component.isAuthenticated = false
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let loginButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-login-button'))
                expect(loginButton_debugElement.nativeElement['disabled']).toEqual(false)
            })
        }))
        it('#3 Should disable login button', async(() => {
            component.isAuthenticated = true
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let loginButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-login-button'))
                expect(loginButton_debugElement.nativeElement['disabled']).toEqual(true)
            })
        }))
        it('#4 Should emit event when clicked', async(() => {
            spyOn(component, "onLogin")
            component.isAuthenticated = false
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let loginButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-login-button'))
                loginButton_debugElement.nativeElement['click']()
                expect(component.onLogin).toHaveBeenCalled()
            })
        }))
    })
    describe('Logout button tests', () => {
        it('#5 Should enable logout button', async(() => {
            component.isAuthenticated = false
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let logoutButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-logout-button'))
                expect(logoutButton_debugElement.nativeElement['disabled']).toEqual(true)
            })
        }))
        it('#6 Should disable logout button', async(() => {
            component.isAuthenticated = true
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let logoutButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-logout-button'))
                expect(logoutButton_debugElement.nativeElement['disabled']).toEqual(false)
            })
        }))
        it('#7 Should emit event when clicked', async(() => {
            spyOn(component, "onLogout")
            component.isAuthenticated = true
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let logoutButton_debugElement: DebugElement = fixture.debugElement.query(By.css('#navbar-logout-button'))
                logoutButton_debugElement.nativeElement['click']()
                expect(component.onLogout).toHaveBeenCalled()
            })
        }))
    })
    describe('Progress spinner tests', () => {
        it('#8 Should show spinner', async(() => {
            component.isProgress = true
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let spinner_debugElement: DebugElement = fixture.debugElement.query(By.css('mat-spinner'))
                expect(spinner_debugElement).toBeTruthy()
            })
        }))
        it('#9 Should hide spinner', async(() => {
            component.isProgress = false
            fixture.detectChanges()
            fixture.whenStable().then(() => {
                let spinner_debugElement: DebugElement = fixture.debugElement.query(By.css('mat-spinner'))
                expect(spinner_debugElement).toBeNull()
            })
        }))
    })
})