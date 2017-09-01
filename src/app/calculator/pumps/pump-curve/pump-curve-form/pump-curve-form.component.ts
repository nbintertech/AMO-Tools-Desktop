import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PumpCurveForm, PumpCurveDataRow } from '../pump-curve';
@Component({
  selector: 'app-pump-curve-form',
  templateUrl: './pump-curve-form.component.html',
  styleUrls: ['./pump-curve-form.component.css']
})
export class PumpCurveFormComponent implements OnInit {
  @Input()
  pumpCurveForm: PumpCurveForm;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();

  selectedFormView: string = 'Equation';

  options: Array<string> = [
    'Diameter',
    'Speed'
  ]
  constructor() { }

  ngOnInit() {
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  addRow() {
    let tmpRow: PumpCurveDataRow = {
      head: 0,
      flow: 0,
      pumpEfficiency: 0
    }
    this.pumpCurveForm.dataRows.push(tmpRow)
  }

  calculate(){
    console.log('update')
    this.emitCalculate.emit(true);
  }
}
