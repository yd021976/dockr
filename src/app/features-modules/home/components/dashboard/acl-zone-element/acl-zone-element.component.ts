import { Component, OnInit, Input, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';

export abstract class aclService {
  abstract isGranted(acl: acl[]): boolean
}
export type acl = { permission: string, ressource: string }
class aclServiceDefault implements aclService {
  isGranted(acl: acl[]) {
    var found: boolean = false

    acl.forEach((acl) => {
      if (acl.permission == "read" && acl.ressource == "*")
        found = true
    })
    return found
  }
}
@Component({
  selector: 'app-acl-zone-element',
  templateUrl: './acl-zone-element.component.html',
  styleUrls: ['./acl-zone-element.component.css']
})
export class AclZoneElementComponent implements OnInit, AfterViewInit {
  @Input('name') name: string
  @Input('acl') acl: acl[]
  @Input('aclService') AclService: aclService = new aclServiceDefault()
  @ViewChild(TemplateRef) tplRef

  constructor() { }

  ngOnInit() { }
  ngAfterViewInit() { }
  public isGranted(): boolean {
    return this.AclService.isGranted(this.acl)
  }
}
