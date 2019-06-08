import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

/**
 * component that display application errors 
 */

@Component( {
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: [ './snack-bar.component.css' ]
} )
export class SnackBarComponent implements OnInit {

  constructor( @Inject( MAT_SNACK_BAR_DATA ) public errors: string[] ) { }

  ngOnInit() { }

}
