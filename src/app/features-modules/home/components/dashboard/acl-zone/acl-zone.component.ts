import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ContentChildren, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AclZoneElementComponent } from '../acl-zone-element/acl-zone-element.component';

@Component({
  selector: 'app-acl-zone-blank',
  template: '<ng-template><div>Default view</div></ng-template>'
})
export class AclZoneBlankComponent {

}

@Component({
  selector: 'app-acl-zone',
  templateUrl: './acl-zone.component.html',
  styleUrls: ['./acl-zone.component.css']
})
export class AclZoneComponent implements OnInit, AfterViewInit {
  @ContentChildren(AclZoneElementComponent) zones: QueryList<AclZoneElementComponent>
  @ViewChild('blank') defaultZone: TemplateRef<any>
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
   * 
   */
  ngAfterViewInit() {
    var tpl: AclZoneElementComponent = null

    this.zones.forEach((item: AclZoneElementComponent) => {
      if (item.isGranted()) {
        return tpl = item
      }
    })
    if (tpl !== null) {
      this.zone = tpl.tplRef
    }
  }
}
