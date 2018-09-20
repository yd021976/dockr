import { BackendConfigClass } from '../../models/backend-config.model';

export abstract class BackendBaseService {
    constructor(protected config: BackendConfigClass = null) {
        // If no config is provided, sets a default one
        if (config == null) this.config = { apiEndPoint: 'http://localhost:3030' };
    }
}