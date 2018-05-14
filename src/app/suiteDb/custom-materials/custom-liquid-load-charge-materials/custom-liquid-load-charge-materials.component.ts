import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { SuiteDbService } from '../../suite-db.service';
import { LiquidLoadChargeMaterial } from '../../../shared/models/materials';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomMaterialsService } from '../custom-materials.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-custom-liquid-load-charge-materials',
  templateUrl: './custom-liquid-load-charge-materials.component.html',
  styleUrls: ['./custom-liquid-load-charge-materials.component.css']
})
export class CustomLiquidLoadChargeMaterialsComponent implements OnInit {
  @Input()
  settings: Settings
  @Input()
  showModal: boolean;

  liquidChargeMaterials: Array<LiquidLoadChargeMaterial>;
  existingMaterial: LiquidLoadChargeMaterial;
  editExistingMaterial: boolean = false;
  deletingMaterial: boolean = false;

  @ViewChild('materialModal') public materialModal: ModalDirective;
  selectedSub: Subscription;
  selectAllSub: Subscription;

  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService, private customMaterialService: CustomMaterialsService) { }

  ngOnInit() {
    this.getCustomMaterials();
    this.selectedSub = this.customMaterialService.getSelected.subscribe((val) => {
      if (val) {
        this.getSelected();
      }
    })

    this.selectAllSub = this.customMaterialService.selectAll.subscribe(val => {
      this.selectAll(val);
    })
  }

  ngOnDestroy(){
    this.selectAllSub.unsubscribe();
    this.selectedSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.showModal.firstChange) {
      if (changes.showModal.currentValue != changes.showModal.previousValue) {
        this.showMaterialModal();
      }
    }
  }
  
  getCustomMaterials() {
    this.liquidChargeMaterials = new Array<LiquidLoadChargeMaterial>();
    this.indexedDbService.getAllLiquidLoadChargeMaterial().then(idbResults => {
      this.liquidChargeMaterials = idbResults;
    });
  }

  editMaterial(id: number) {
    this.indexedDbService.getLiquidLoadChargeMaterial(id).then(idbResults => {
      this.existingMaterial = idbResults;
      this.editExistingMaterial = true;
      this.showMaterialModal();
    });
  }

  deleteMaterial(id: number) {
    this.indexedDbService.getLiquidLoadChargeMaterial(id).then(idbResults => {
      this.existingMaterial = idbResults;
      this.editExistingMaterial = true;
      this.deletingMaterial = true;
      this.showMaterialModal();
    });
  }

  showMaterialModal() {
    this.showModal = true;
    this.materialModal.show();
  }

  hideMaterialModal(event?: any) {
    this.materialModal.hide();
    this.showModal = false;
    this.editExistingMaterial = false;
    this.deletingMaterial = false;
    this.getCustomMaterials();
  }
  getSelected() {
    let selected: Array<LiquidLoadChargeMaterial> = _.filter(this.liquidChargeMaterials, (material) => { return material.selected == true });
    this.customMaterialService.selectedLiquidLoadCharge = selected;
  }
  selectAll(val: boolean) {
    this.liquidChargeMaterials.forEach(material => {
      material.selected = val;
    })
  }
}
