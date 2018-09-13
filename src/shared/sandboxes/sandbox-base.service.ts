import { Observable } from "rxjs";
import { BackendServiceConnectionState } from '../models/backend-service-connection-state.model';

export abstract class SandboxBaseService {
    protected user: any;
    public ApiServiceConnectionState$: Observable<BackendServiceConnectionState>;

    constructor() { }
}