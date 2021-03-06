import { Component, OnInit, Input } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { FormGroup } from '@angular/forms';
import { EquipmentCurveService } from '../equipment-curve.service';
import { SystemAndEquipmentCurveService } from '../../system-and-equipment-curve.service';
import { Subscription } from 'rxjs';
import { CurveDataService } from '../../curve-data.service';
import { ByEquationInputs } from '../../../../shared/models/system-and-equipment-curve';

@Component({
  selector: 'app-by-equation-form',
  templateUrl: './by-equation-form.component.html',
  styleUrls: ['./by-equation-form.component.css']
})
export class ByEquationFormComponent implements OnInit {
  @Input()
  equipmentType: string;
  @Input()
  settings: Settings;

  byEquationForm: FormGroup;
  formLabel: string;
  flowUnit: string;
  orderOptions: Array<number> = [
    2, 3, 4, 5, 6
  ]
  resetFormsSub: Subscription;
  constructor(private equipmentCurveService: EquipmentCurveService, private systemAndEquipmentCurveService: SystemAndEquipmentCurveService,
    private curveDataService: CurveDataService) { }

  ngOnInit() {
    this.setFormLabelAndUnit();
    this.initForm();
    this.resetFormsSub = this.curveDataService.resetForms.subscribe(val => {
      if (val == true) {
        this.resetForm();
      }
    });
  }

  ngOnDestroy() {
    this.resetFormsSub.unsubscribe();
  }

  initForm() {
    let defaultData: ByEquationInputs = this.systemAndEquipmentCurveService.byEquationInputs.getValue();
    if (defaultData == undefined) {
      if (this.equipmentType == 'fan') {
        defaultData = this.equipmentCurveService.getByEquationDefault(this.flowUnit, this.settings.fanPressureMeasurement, 'inH2o');
      } else if (this.equipmentType == 'pump') {
        defaultData = this.equipmentCurveService.getByEquationDefault(this.flowUnit, this.settings.distanceMeasurement, 'ft');
      }
    }
    this.systemAndEquipmentCurveService.byEquationInputs.next(defaultData);
    this.byEquationForm = this.equipmentCurveService.getByEquationFormFromObj(defaultData);
  }

  resetForm() {
    let defaultData: ByEquationInputs = this.systemAndEquipmentCurveService.byEquationInputs.getValue();
    this.byEquationForm = this.equipmentCurveService.getByEquationFormFromObj(defaultData);
  }

  setFormLabelAndUnit() {
    if (this.equipmentType == 'fan') {
      this.formLabel = 'Pressure Equation Coefficients';
      this.flowUnit = this.settings.fanFlowRate;
    } else if (this.equipmentType == 'pump') {
      this.formLabel = 'Head Equation Coefficients';
      this.flowUnit = this.settings.flowMeasurement;
    }
  }

  save() {
    if (this.byEquationForm.valid) {
      let byEquationInputs: ByEquationInputs = this.equipmentCurveService.getByEquationObjFromForm(this.byEquationForm);
      this.systemAndEquipmentCurveService.byEquationInputs.next(byEquationInputs);
    } else {
      this.systemAndEquipmentCurveService.byEquationInputs.next(undefined);
    }

  }

  focusField(str: string) {
    this.systemAndEquipmentCurveService.focusedCalculator.next(this.equipmentType + '-curve');
    this.systemAndEquipmentCurveService.currentField.next(str);
  }
}
