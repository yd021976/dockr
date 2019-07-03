import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component( {
    selector: 'app-search-bar',
    templateUrl: './searchbar.component.html',
    styleUrls: [ './searchbar.component.scss' ]
} )
export class SearchbarComponent implements OnInit {
    @Output( 'searchText' ) search_text: EventEmitter<string> = new EventEmitter<string>()
    constructor() { }
    ngOnInit() { }
    onText( event ) {
        this.search_text.emit( event )
    }
}