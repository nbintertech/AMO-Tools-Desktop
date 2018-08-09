import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-gas-leakage-losses-help',
  templateUrl: './gas-leakage-losses-help.component.html',
  styleUrls: ['./gas-leakage-losses-help.component.css']
})
export class GasLeakageLossesHelpComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  currentField: string;

  constructor() { }

  ngOnInit() {
  }

}
