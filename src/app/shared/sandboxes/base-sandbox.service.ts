import { Observable, BehaviorSubject } from "rxjs";
import { Select, Store } from "@ngxs/store";

import { BackendConnectionState } from '../models/backend.connection.state.model';
import { ApplicationState } from "../store/states/application.state";
import { UserModel } from "../models/user.model";
import { AppLoggerServiceInterface } from "../services/logger/app-logger/service/app-logger.service";

export abstract class BaseSandboxService {
    public ApiServiceConnectionState$: BehaviorSubject<BackendConnectionState>;
    @Select( ApplicationState.isLoggedin ) public isLoggedin$: Observable<boolean>
    @Select( ApplicationState.getCurrentUser ) public currentUser$: Observable<UserModel>
    @Select( ApplicationState.isProgress ) public isProgress$: Observable<boolean>

    constructor( protected store: Store, protected loggerService: AppLoggerServiceInterface ) { }
}