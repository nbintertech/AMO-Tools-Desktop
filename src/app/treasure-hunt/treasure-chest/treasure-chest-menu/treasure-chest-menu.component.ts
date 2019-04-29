import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreasureHunt } from '../../../shared/models/treasure-hunt';

@Component({
  selector: 'app-treasure-chest-menu',
  templateUrl: './treasure-chest-menu.component.html',
  styleUrls: ['./treasure-chest-menu.component.css']
})
export class TreasureChestMenuComponent implements OnInit {
  @Input()
  treasureHunt: TreasureHunt;

  @Output('emitChangeEnergyType')
  emitChangeEnergyType = new EventEmitter<string>();
  @Output('emitChangeCalculatorType')
  emitChangeCalculatorType = new EventEmitter<string>();

  displayEnergyType: string = 'All';
  displayCalculatorType: string = 'All';

  energyTypeOptions: Array<{ value: string, numCalcs: number }> = [];
  calculatorTypeOptions: Array<{ value: string, numCalcs: number }> = [];
  constructor() { }

  ngOnInit() {
    this.setEnergyTypeOptions();
  }

  setEnergyType() {
    this.emitChangeEnergyType.emit(this.displayEnergyType);
    this.setCalculatorOptions();
  }

  setCalculatorType() {
    this.emitChangeCalculatorType.emit(this.displayCalculatorType);
  }

  setEnergyTypeOptions() {
    let numElectricity: number = this.checkElectricity();
    if (numElectricity) {
      this.energyTypeOptions.push({ value: 'Electricity', numCalcs: numElectricity });
    }
    let numOppSheets: number = this.checkOpportunitySheets();
    if (numOppSheets) {
      this.energyTypeOptions.push({ value: 'Other', numCalcs: numOppSheets });
    }
    this.energyTypeOptions.unshift({ value: 'All', numCalcs: numElectricity + numOppSheets});
    this.calculatorTypeOptions.unshift({ value: 'All', numCalcs: numElectricity + numOppSheets });
  }

  setCalculatorOptions() {
    let numCalcs: number = 0;
    if (this.displayEnergyType == 'All' || this.displayEnergyType == 'Electricity') {
      numCalcs = numCalcs + this.checkElectricity();
    }
    if (this.displayEnergyType == 'All') {
      numCalcs = numCalcs + this.checkOpportunitySheets();
    }
    this.calculatorTypeOptions.unshift({ value: 'All', numCalcs: numCalcs });
  }

  checkElectricity(): number {
    let numElectricity: number = 0;
    if (this.treasureHunt.lightingReplacements && this.treasureHunt.lightingReplacements.length != 0) {
      this.calculatorTypeOptions.push({ value: 'Lighting Replacement', numCalcs: this.treasureHunt.lightingReplacements.length });
      numElectricity = this.treasureHunt.lightingReplacements.length;
    }
    if (this.treasureHunt.motorDrives && this.treasureHunt.motorDrives.length != 0) {
      this.calculatorTypeOptions.push({ value: 'Motor Drive', numCalcs: this.treasureHunt.motorDrives.length });
      numElectricity = numElectricity + this.treasureHunt.motorDrives.length;
    }
    if (this.treasureHunt.replaceExistingMotors && this.treasureHunt.replaceExistingMotors.length != 0) {
      this.calculatorTypeOptions.push({ value: 'Replace Existing Motor', numCalcs: this.treasureHunt.replaceExistingMotors.length });
      numElectricity = numElectricity + this.treasureHunt.replaceExistingMotors.length;
    }
    return numElectricity;
  }

  checkOpportunitySheets(): number {
    let numOppSheets: number;
    if (this.treasureHunt.opportunitySheets && this.treasureHunt.opportunitySheets.length != 0) {
      this.calculatorTypeOptions.push({ value: 'Opportunity Sheet', numCalcs: this.treasureHunt.opportunitySheets.length });
      numOppSheets = this.treasureHunt.opportunitySheets.length;
    }
    return numOppSheets;
  }
}
