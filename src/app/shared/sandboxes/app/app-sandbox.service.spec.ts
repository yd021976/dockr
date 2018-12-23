import { fakeAsync, async, tick, flushMicrotasks, TestBed, inject } from '@angular/core/testing';
import { mock, instance, when, deepEqual, reset, verify, resetCalls, spy } from 'ts-mockito';
import { BehaviorSubject } from 'rxjs';
import { Store, NgxsModule } from '@ngxs/store';

import { AppError, errorType } from '../../models/app-error.model';
import { AppLoggerService } from '../../services/logger/app-logger/service/app-logger.service';
import { AppLoggerServiceToken } from '../../services/logger/app-logger/app-logger-token'
import { NotificationBaseService } from '../../services/notifications/notifications-base.service';
import { AuthService } from '../../services/auth/auth.service'
import { AppSandboxService } from './app-sandbox.service';
import { UserBackendApiModel } from '../../models/user.model';
import { FeathersjsBackendService } from '../../services/backend/socketio/backend-feathers.service';
import { AppLoggerModule } from '../../services/logger/app-logger/app-logger.module';
import { ApplicationState } from '../../store/states/application.state';
import { UserState } from '../../store/states/user.state';
import { TemplatesState } from '../../store/states/templates.state';
import { UserLoginSuccessAction } from '../../store/actions/user.actions';

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
        beforeAll(() => {
        })
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
                expect(store.dispatch).toHaveBeenCalledWith(new UserLoginSuccessAction(authResult))
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