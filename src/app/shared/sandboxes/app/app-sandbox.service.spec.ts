import { TestBed, inject } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';

import { AuthService } from '../../services/auth/auth.service'
import { AppSandboxService } from './app-sandbox.service';
import { UserBackendApiModel } from '../../models/user.model';
import { AppLoggerModule } from '../../services/logger/app-logger/app-logger.module';
import { ApplicationState } from '../../store/states/application.state';
import { UserState } from '../../store/states/user.state';
import { TemplatesState } from '../../store/states/templates.state';
import { User_Action_Login_Success } from '../../store/actions/user.actions';

describe('App-sandbox', () => {
    describe('#Unit-Tests', () => {
        const AnonymousLoginRequest = {
            "strategy": "anonymous"
        }
        const LocalLoginRequest = {
            "strategy": "local",
            "email": "jasmine_test",
            "password": "test"
        }
       
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([ApplicationState, UserState, TemplatesState]),
                    AppLoggerModule.forRoot()
                ],
                providers: [
                    AppSandboxService
                ]
            })
        })

        it('#1 Should dispatch store action when user is loggin in', inject([AuthService, Store, AppSandboxService],
            async (auth: AuthService, store: Store, sandbox: AppSandboxService) => {
                console.log('#1')
                let authResult: UserBackendApiModel
                // Spy the store object
                spyOn(store, "dispatch").and.callThrough()

                await auth.authenticate(LocalLoginRequest).then((result) => {
                    authResult = result
                })

                // Expect that sandbox dispatch the store action correctly
                expect(store.dispatch).toHaveBeenCalledWith(new User_Action_Login_Success(authResult))
            }))

        it('#2 Should update <isLoggedin$> Observable to true when user is loggin in', inject([AuthService, Store, AppSandboxService],
            async (auth: AuthService, store: Store, sandbox: AppSandboxService) => {
                console.log('#2')
                var loggedIn: boolean = false;

                await auth.authenticate(LocalLoginRequest)
                
                let subscribe = sandbox.isLoggedin$.subscribe((value) => {
                    loggedIn = value
                })
                subscribe.unsubscribe()
                // await sandbox.isLoggedin$.pipe().subscribe((state) => {
                //     loggedIn = state
                // })

                // Expect loggin observable is updated
                expect(loggedIn).toEqual(true)
            }))
        it('#3 Should update <isLoggedin$> Observable to false when user logged in as anonymous', inject([AuthService, Store, AppSandboxService],
            async (auth: AuthService, store: Store, sandbox: AppSandboxService) => {
                console.log('#3')
                var loggedIn: boolean = true;

                await auth.authenticate(AnonymousLoginRequest)
                // Should set result to false as user is anonymous
                let subscribe = sandbox.isLoggedin$.subscribe((value) => {
                    loggedIn = value
                })
                subscribe.unsubscribe()
                // await sandbox.isLoggedin$.pipe().subscribe((state) => {
                //     loggedIn = state
                // })

                // Expect loggin observable is updated
                expect(loggedIn).toEqual(false)
            }))
    })
})