import { Role } from './internals/admin.permissions.entity.utilities.role';
import { Service } from './internals/admin.permissions.entity.utilities.service';
import { Operation } from './internals/admin.permissions.entity.utilities.operation';
import { Field } from './internals/admin.permissions.entity.utilities.field';
import { AllowedProperty } from './internals/admin.permissions.entity.utilities.allowed.prop';

// the helper function
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
export interface EntityUtilities extends Role, Service, Operation, Field, AllowedProperty { }
export class EntityUtilities { }
applyMixins(EntityUtilities, [Role, Service, Operation, Field, AllowedProperty])