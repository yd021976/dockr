import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-admin-site-sections-roles-list',
    templateUrl: './site.sections.roles.list.component.html',
    styleUrls: ['./site.sections.roles.list.component.scss']
})
export class AdminSiteSectionsRolesListComponent {
    @Input('roles') roles: string[]
    @Input('selected') selected: string
    @Output('role_selected') role_selected: EventEmitter<string> = new EventEmitter<string>()

    constructor() { }
    select_role(role: string) {
        this.role_selected.emit(role)
    }
}