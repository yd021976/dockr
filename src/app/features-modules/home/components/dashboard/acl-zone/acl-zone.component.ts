import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ContentChildren, TemplateRef, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { AclZoneElementComponent } from '../acl-zone-element/acl-zone-element.component';

@Component({
  selector: 'app-acl-zone',
  templateUrl: './acl-zone.component.html',
  styleUrls: ['./acl-zone.component.css']
})
export class AclZoneComponent implements OnInit, AfterViewInit {
  @Input('authorizeCheckFunction') checkFunction:Function
  @ContentChildren(AclZoneElementComponent) zones: QueryList<AclZoneElementComponent>
  @ViewChild('blank', { static: true }) defaultZone: TemplateRef<any>
  zone: TemplateRef<any>
  private vc: ViewContainerRef

  constructor(vc: ViewContainerRef) {
    // TODO: Should we really need this ? It is actually not used
    this.vc = vc
  }

  /**
   * By default, the "zone" template ref is set to the #blank component template
   */
  ngOnInit() {
    this.zone = this.defaultZone
  }

  /**
   * The first acl zone element that is granted will be shown, others will be ignored
   * if no element is "granted", then nothing will be shown
   */
  ngAfterViewInit() {
    var promises: Promise<AclZoneElementComponent>[] = []

    
    this.zones.forEach((item: AclZoneElementComponent) => {
      promises.push(this.isAuthorized(item).then((authorized) => {
        if (authorized == true) return item
        return null
      }))
    })
    Promise.all(promises).then((templates: AclZoneElementComponent[]) => {
      var template = templates.filter((value) => value !== null)
      if (template.length != 0) this.zone = template[0].tplRef
    })
  }
  private isAuthorized(item:AclZoneElementComponent):Promise<boolean> {
    return this.checkFunction(item.authorize,item.unAuthorize)
  }
}
