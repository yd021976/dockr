export interface Lock {
    name: string,
    isLocked?: boolean
}

export class ApplicationLocksStateModel {
    locks: Lock[]
}