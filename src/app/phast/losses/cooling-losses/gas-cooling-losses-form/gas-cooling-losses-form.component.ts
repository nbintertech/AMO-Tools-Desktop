import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { CoolingLossesCompareService } from '../cooling-losses-compare.service';

@Component({
  selector: 'app-gas-cooling-losses-form',
  templateUrl: './gas-cooling-losses-form.component.html',
  styleUrls: ['./gas-cooling-losses-form.component.css']
})
export class GasCoolingLossesFormComponent implements OnInit {
  @Input()
  lossesForm: any;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  lossState: any;
  @Input()
  baselineSelected: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('saveEmit')
  saveEmit = new EventEmitter<boolean>();
  @Input()
  lossIndex: number;

  @ViewChild('lossForm') lossForm: ElementRef;
  form: any;
  elements: any;

  firstChange: boolean = true;
  counter: any;
  constructor(private windowRefService: WindowRefService, private coolingLossesCompareService: CoolingLossesCompareService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.firstChange) {
      if (!this.baselineSelected) {
        this.disableForm();
      } else {
        this.enableForm();
      }
    } else {
      this.firstChange = false;
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.initDifferenceMonitor();
  }


  disableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = true;
    }
  }

  enableForm() {
    this.elements = this.lossForm.nativeElement.elements;
    for (var i = 0, len = this.elements.length; i < len; ++i) {
      this.elements[i].disabled = false;
    }
  }

  checkForm() {
    this.lossState.saved = false;
    if (this.lossesForm.status == 'VALID') {
      this.calculate.emit(true)
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }
  emitSave() {
    this.saveEmit.emit(true);
  }

  startSavePolling() {
    this.checkForm();
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.emitSave();
    }, 3000)
  }

  initDifferenceMonitor() {
    if (this.coolingLossesCompareService.baselineCoolingLosses && this.coolingLossesCompareService.modifiedCoolingLosses && this.coolingLossesCompareService.differentArray.length != 0) {
      let doc = this.windowRefService.getDoc();

      //avgSpecificHeat
      this.coolingLossesCompareService.differentArray[this.lossIndex].different.gasCoolingLossDifferent.specificHeat.subscribe((val) => {
        let avgSpecificHeatElements = doc.getElementsByName('avgSpecificHeat_' + this.lossIndex);
        avgSpecificHeatElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //gasFlow
      this.coolingLossesCompareService.differentArray[this.lossIndex].different.gasCoolingLossDifferent.flowRate.subscribe((val) => {
        let gasFlowElements = doc.getElementsByName('gasFlow_' + this.lossIndex);
        gasFlowElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //inletTemp
      this.coolingLossesCompareService.differentArray[this.lossIndex].different.gasCoolingLossDifferent.initialTemperature.subscribe((val) => {
        let inletTempElements = doc.getElementsByName('inletTemp_' + this.lossIndex);
        inletTempElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //outletTemp
      this.coolingLossesCompareService.differentArray[this.lossIndex].different.gasCoolingLossDifferent.finalTemperature.subscribe((val) => {
        let outletTempElements = doc.getElementsByName('outletTemp_' + this.lossIndex);
        outletTempElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
      //correctionFactor
      this.coolingLossesCompareService.differentArray[this.lossIndex].different.gasCoolingLossDifferent.correctionFactor.subscribe((val) => {
        let correctionFactorElements = doc.getElementsByName('correctionFactor_' + this.lossIndex);
        correctionFactorElements.forEach(element => {
          element.classList.toggle('indicate-different', val);
        });
      })
    }
  }
}
