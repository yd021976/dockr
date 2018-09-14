import { Observable, BehaviorSubject } from "rxjs";
import { BackendServiceConnectionState } from '../models/backend-service-connection-state.model';

export abstract class SandboxBaseService {
    protected user: any;
    protected ApiServiceConnectionState: BackendServiceConnectionState;
    public ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;
    public isAuthenticated$: Observable<boolean>;

    constructor() {
    }
    
    navigateLogin() { }
    navigateLogout() { }
}