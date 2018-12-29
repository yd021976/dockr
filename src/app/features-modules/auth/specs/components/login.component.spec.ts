import { TestBed, ComponentFixture, fakeAsync, async, tick } from "@angular/core/testing";
import { LoginComponent } from "../../components/login/login.component";
import { MatInputModule, MatFormFieldModule, MatButtonModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('Auth module -- Components -- Login', () => {
    var component: LoginComponent
    var fixture: ComponentFixture<LoginComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, NoopAnimationsModule],
            providers: [],
            declarations: [LoginComponent],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance;
    })
    it('#1 Should be created', () => {
        expect(component).toBeDefined();
    })
    it('#2 Should show error text when an error occured', () => {
        component.error = "There is an error"
        fixture.detectChanges()
        const el = (fixture.nativeElement as HTMLElement).querySelector('#login-component-loginerror-container.login-error')
        expect(el).not.toBeNull()
    })
    it('#3 Should emit credentials when login is clicked', fakeAsync(() => {
        const email = (fixture.nativeElement as HTMLElement).querySelector('#login-component-email') as HTMLInputElement
        const password = (fixture.nativeElement as HTMLElement).querySelector('#login-component-password') as HTMLInputElement
        const loginButton = (fixture.nativeElement as HTMLElement).querySelector('#login-component-loginbutton') as HTMLButtonElement

        fixture.detectChanges()
        tick()

        email.value = 'test'
        password.value = 'password'
        email.dispatchEvent(new Event('input'))
        password.dispatchEvent(new Event('input'))
        tick()

        var loginCredentials = null
        component.login.subscribe((credentials) => {
            loginCredentials = credentials
        })
        loginButton.click()
        expect(loginCredentials).toEqual({ strategy: 'local', email: 'test', password: 'password' })

    }))
})