import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-admin-site-zones-roles-list',
    templateUrl: './site.zones.roles.list.component.html',
    styleUrls: ['./site.zones.roles.list.component.scss']
})
export class AdminSiteZonesRolesListComponent {
    @Input('roles') roles: string[]
    @Input('selected') selected: string
    @Output('role_selected') role_selected: EventEmitter<string> = new EventEmitter<string>()

    constructor() { }
    select_role(role: string) {
        this.role_selected.emit(role)
    }
}