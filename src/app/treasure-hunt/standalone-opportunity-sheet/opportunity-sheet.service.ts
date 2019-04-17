import { Injectable } from '@angular/core';
import { OpportunitySheet, OpportunitySheetResult, OpportunitySheetResults, EnergyUseItem } from '../../shared/models/treasure-hunt';
import { Settings } from '../../shared/models/settings';
import * as _ from 'lodash';

@Injectable()
export class OpportunitySheetService {

  constructor() { }


  getResults(opportunitySheet: OpportunitySheet, settings: Settings): OpportunitySheetResults {
    let baselineElectricityResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.electricityCost, 'Electricity');
    let modificationElectricityResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.electricityCost, 'Electricity');
    let electricityResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineElectricityResult, modificationElectricityResult);

    let baselineGasResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.fuelCost, 'Gas');
    let modificationGasResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.fuelCost, 'Gas');
    let gasResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineGasResult, modificationGasResult);

    let baselineCompressedAirResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.compressedAirCost, 'Compressed Air');
    let modificationCompressedAirResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.compressedAirCost, 'Compressed Air');
    let compressedAirResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineCompressedAirResult, modificationCompressedAirResult);

    let baselineOtherFuelResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.otherFuelCost, 'Other Fuel');
    let modificationOtherFuelResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.otherFuelCost, 'Other Fuel');
    let otherFuelResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineOtherFuelResult, modificationOtherFuelResult);

    let baselineSteamResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.steamCost, 'Steam');
    let modificationSteamResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.steamCost, 'Steam');
    let steamResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineSteamResult, modificationSteamResult);

    let baselineWaterResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.waterCost, 'Water');
    let modificationWaterResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.waterCost, 'Water');
    let waterResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineWaterResult, modificationWaterResult);

    let baselineWasterWaterResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.baselineEnergyUseItems, settings.waterWasteCost, 'WWT');
    let modificationWasteWaterResult: { energyUse: number, energyCost: number } = this.getEnergyUseData(opportunitySheet.modificationEnergyUseItems, settings.waterWasteCost, 'WWT');
    let wasteWaterResults: OpportunitySheetResult = this.getOpportunitySheetResult(baselineWasterWaterResult, modificationWasteWaterResult);

    let totalCostSavings: number = electricityResults.energyCostSavings + gasResults.energyCostSavings + compressedAirResults.energyCostSavings + otherFuelResults.energyCostSavings + steamResults.energyCostSavings + waterResults.energyCostSavings + waterResults.energyCostSavings;
    return {
      electricityResults: electricityResults,
      gasResults: gasResults,
      compressedAirResults: compressedAirResults,
      otherFuelResults: otherFuelResults,
      steamResults: steamResults,
      waterResults: waterResults,
      wasteWaterResults: wasteWaterResults,
      totalEnergySavings: 0,
      totalCostSavings: totalCostSavings
    };
  }

  getEnergyUseData(oppItems: Array<EnergyUseItem>, unitCost: number, type: string): { energyUse: number, energyCost: number } {
    let items: Array<EnergyUseItem> = oppItems.filter(item => { return item.type == type });
    let energyUse: number = 0;
    if (items) {
      items.forEach(item => {
        energyUse = energyUse + item.amount;
      })
    }
    return {
      energyUse: energyUse,
      energyCost: energyUse * unitCost
    }
  }

  getOpportunitySheetResult(baseline: { energyUse: number, energyCost: number }, modification: { energyUse: number, energyCost: number }): OpportunitySheetResult {
    return {
      baselineEnergyUse: baseline.energyUse,
      baselineEnergyCost: baseline.energyCost,
      modificationEnergyUse: modification.energyUse,
      modificationEnergyCost: modification.energyCost,
      energySavings: baseline.energyUse - modification.energyUse,
      energyCostSavings: baseline.energyCost - modification.energyCost
    }
  }

}
