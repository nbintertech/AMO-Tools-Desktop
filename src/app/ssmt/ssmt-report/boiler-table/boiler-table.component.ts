import { Component, OnInit, Input } from '@angular/core';
import { BoilerOutput } from '../../../shared/models/steam/steam-outputs';
import { SSMTInputs } from '../../../shared/models/steam/ssmt';

@Component({
  selector: 'app-boiler-table',
  templateUrl: './boiler-table.component.html',
  styleUrls: ['./boiler-table.component.css']
})
export class BoilerTableComponent implements OnInit {
  @Input()
  boiler: BoilerOutput;
  @Input()
  inputData: SSMTInputs;
  
  constructor() { }

  ngOnInit() {
  }

}
