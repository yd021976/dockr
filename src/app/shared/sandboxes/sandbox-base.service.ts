import { Observable, BehaviorSubject } from "rxjs";
import { BackendServiceConnectionState } from '../models/backend-service-connection-state.model';

export abstract class SandboxBaseService {
    public ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;
    public isAuthenticated$: Observable<boolean>;

    constructor() {
        // TODO: remove Observable creation here : Should be available in dedicated service
        this.isAuthenticated$ = new BehaviorSubject(false);
    }
    
    navigateLogin() { }
    navigateLogout() { }
}