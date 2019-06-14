import { Component, OnInit, Input, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-acl-zone-element',
  templateUrl: './acl-zone-element.component.html',
  styleUrls: ['./acl-zone-element.component.css']
})
export class AclZoneElementComponent implements OnInit, AfterViewInit {
  @Input('name') name: string = ""
  @Input('authorize') authorize: any
  @Input('unAuthorize') unAuthorize: any
  @ViewChild(TemplateRef, { static: true }) tplRef

  constructor() { }

  ngOnInit() { }
  ngAfterViewInit() { }
}
