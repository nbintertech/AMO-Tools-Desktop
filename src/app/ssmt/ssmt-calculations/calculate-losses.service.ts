import { Injectable } from '@angular/core';
import { SSMTLosses, SSMTOutput, TurbineOutput, SteamPropertiesOutput, FlashTankOutput, DeaeratorOutput, ProcessSteamUsage, BoilerOutput } from '../../shared/models/steam/steam-outputs';
import { SSMTInputs } from '../../shared/models/steam/ssmt';
import { SteamService } from '../../calculator/steam/steam.service';
import { Settings } from '../../shared/models/settings';
import { ConvertUnitsService } from '../../shared/convert-units/convert-units.service';

@Injectable()
export class CalculateLossesService {

  constructor(private steamService: SteamService, private convertUnitsService: ConvertUnitsService) { }

  calculateLosses(ssmtResults: SSMTOutput, inputData: SSMTInputs, settings: Settings): SSMTLosses {
    let ssmtLosses: SSMTLosses = this.initLosses();
    ssmtLosses.stack = this.calculateStack(ssmtResults);
    ssmtLosses.blowdown = this.calculateBlowdown(ssmtResults.boilerOutput, settings);
    ssmtLosses.deaeratorVentLoss = this.calculateDeaeratorVentLoss(ssmtResults.deaeratorOutput, settings);
    ssmtLosses.highPressureProcessLoss = this.calculateProcessLoss(ssmtResults.highPressureProcessUsage, ssmtResults.highPressureCondensate, settings);

    //
    ssmtLosses.highPressureHeader = ssmtResults.highPressureSteamHeatLoss.heatLoss;
    if (inputData.turbineInput.condensingTurbine.useTurbine == true) {
      ssmtLosses.condensingTurbineUsefulEnergy = this.calculateTurbineUsefulEnergy(ssmtResults.condensingTurbine);
      ssmtLosses.condensingTurbineEfficiencyLoss = this.calculateTurbineLoss(ssmtResults.condensingTurbine);

    }

    if (inputData.headerInput.highPressure.flashCondensateReturn == true) {
      ssmtLosses.condensateFlashTankLoss = this.calculateCondensateFlashTankLoss(ssmtResults.condensateFlashTank);
    }
    if (inputData.headerInput.numberOfHeaders > 1) {
      //low pressure vent
      ssmtLosses.lowPressureVentLoss = this.calculateLowPressureVentLoss(ssmtResults.ventedLowPressureSteam, settings);
      //header
      ssmtLosses.lowPressureHeader = ssmtResults.lowPressureSteamHeatLoss.heatLoss;
      //process
      ssmtLosses.lowPressureProcessLoss = this.calculateProcessLoss(ssmtResults.lowPressureProcessUsage, ssmtResults.lowPressureCondensate, settings);
      //turbine
      if (inputData.turbineInput.highToLowTurbine.useTurbine == true) {
        ssmtLosses.highToLowTurbineUsefulEnergy = this.calculateTurbineUsefulEnergy(ssmtResults.highToLowPressureTurbine);
        ssmtLosses.highToLowTurbineEfficiencyLoss = this.calculateTurbineLoss(ssmtResults.highToLowPressureTurbine);

      }

      if (inputData.headerInput.numberOfHeaders == 3) {
        ssmtLosses.mediumPressureHeader = ssmtResults.mediumPressureSteamHeatLoss.heatLoss;
        if (inputData.turbineInput.highToMediumTurbine.useTurbine == true) {
          ssmtLosses.highToMediumTurbineUsefulEnergy = this.calculateTurbineUsefulEnergy(ssmtResults.highPressureToMediumPressureTurbine);
          ssmtLosses.highToMediumTurbineEfficiencyLoss = this.calculateTurbineLoss(ssmtResults.highPressureToMediumPressureTurbine);
        }
        if (inputData.turbineInput.mediumToLowTurbine.useTurbine == true) {
          ssmtLosses.mediumToLowTurbineUsefulEnergy = this.calculateTurbineUsefulEnergy(ssmtResults.mediumToLowPressureTurbine);
          ssmtLosses.mediumToLowTurbineEfficiencyLoss = this.calculateTurbineLoss(ssmtResults.mediumToLowPressureTurbine);
        }
        ssmtLosses.mediumPressureProcessLoss = this.calculateProcessLoss(ssmtResults.mediumPressureProcessUsage, ssmtResults.mediumPressureCondensate, settings);
      }
    }
    ssmtLosses.condensateLosses = this.calculateCondensateLoss(ssmtResults, settings);
    ssmtLosses.condensingLosses = this.calculateCondensingLosses(ssmtResults.condensingTurbine, inputData, settings);

    ssmtLosses.fuelEnergy = ssmtResults.boilerOutput.fuelEnergy;
    ssmtLosses.makeupWaterEnergy = this.calculateMakeupWaterEnergy(ssmtResults.makeupWater, settings);
    return ssmtLosses;
  }

  calculateStack(ssmtResults: SSMTOutput): number {
    let loss: number = ssmtResults.boilerOutput.fuelEnergy - ssmtResults.boilerOutput.boilerEnergy;
    return loss;
  }

  calculateBlowdown(boilerOutput: BoilerOutput, settings: Settings): number {
    let energy: number = this.calculateEnergy(boilerOutput.blowdownMassFlow, boilerOutput.blowdownSpecificEnthalpy, settings)
    energy = this.convertUnitsService.value(energy).from('MJ').to(settings.steamEnergyMeasurement);
    return energy;
  }

  calculateTurbineUsefulEnergy(turbineOutput: TurbineOutput): number {
    let loss: number = turbineOutput.energyOut * turbineOutput.generatorEfficiency / 100;
    return loss;
  }

  calculateTurbineLoss(turbineOutput: TurbineOutput): number {
    let loss: number = turbineOutput.energyOut * (1 - turbineOutput.generatorEfficiency / 100);
    return loss;
  }

  calculateCondensingLosses(turbineOutput: TurbineOutput, inputData: SSMTInputs, settings: Settings): number {
    if (inputData.turbineInput.condensingTurbine.useTurbine == true) {
      let condenserPressure: number = this.convertUnitsService.value(inputData.turbineInput.condensingTurbine.condenserPressure).from(settings.steamVacuumPressure).to(settings.steamPressureMeasurement);
      let outletProperties: SteamPropertiesOutput = this.steamService.steamProperties(
        {
          pressure: condenserPressure,
          thermodynamicQuantity: 3,
          quantityValue: 0
        },
        settings
      );
      let loss: number = this.calculateEnergy(turbineOutput.massFlow, (turbineOutput.outletSpecificEnthalpy - outletProperties.specificEnthalpy), settings);
      return loss;
    } else {
      return 0;
    }
  }

  calculateCondensateLoss(ssmtResults: SSMTOutput, settings: Settings): number {
    let combinedCondensateEnergy: number = this.calculateEnergy(ssmtResults.combinedCondensate.massFlow, ssmtResults.combinedCondensate.specificEnthalpy, settings);
    let returnCondensateEnergy: number = this.calculateEnergy(ssmtResults.returnCondensate.massFlow, ssmtResults.returnCondensate.specificEnthalpy, settings);
    let loss: number = combinedCondensateEnergy - returnCondensateEnergy;
    loss = this.convertUnitsService.value(loss).from('MJ').to(settings.steamEnergyMeasurement);
    return loss;
  }

  calculateLowPressureVentLoss(lowPressureVentedSteam: SteamPropertiesOutput, settings: Settings): number {
    if (lowPressureVentedSteam) {
      let loss: number = this.calculateEnergy(lowPressureVentedSteam.massFlow, lowPressureVentedSteam.specificEnthalpy, settings);
      return loss;
    } else {
      return 0;
    }
  }

  calculateCondensateFlashTankLoss(condensateFlashTank: FlashTankOutput): number {
    let loss: number = condensateFlashTank.outletGasSpecificEnthalpy * condensateFlashTank.outletGasMassFlow;
    return loss;
  }

  calculateDeaeratorVentLoss(deaeratorOutput: DeaeratorOutput, settings: Settings): number {
    let loss: number = this.calculateEnergy(deaeratorOutput.ventedSteamMassFlow, deaeratorOutput.ventedSteamSpecificEnthalpy, settings);
    loss = this.convertUnitsService.value(loss).from('MJ').to(settings.steamEnergyMeasurement);

    return loss;
  }

  calculateProcessLoss(processSteam: ProcessSteamUsage, condensate: SteamPropertiesOutput, settings): number {
    let energy: number = this.calculateEnergy(condensate.massFlow, condensate.specificEnthalpy, settings)
    energy = this.convertUnitsService.value(energy).from('MJ').to(settings.steamEnergyMeasurement);
    let loss: number = (processSteam.energyFlow - (energy) - processSteam.processUsage);
    return loss;
  }

  calculateMakeupWaterEnergy(makeupWater: SteamPropertiesOutput, settings: Settings): number {
    let energy: number = this.calculateEnergy(makeupWater.massFlow, makeupWater.specificEnthalpy, settings)
    energy = this.convertUnitsService.value(energy).from('MJ').to(settings.steamEnergyMeasurement);

    return energy;
  }

  calculateEnergy(massFlow: number, specificEnthalpy: number, settings: Settings): number {
    let convertedMassFlow: number = this.convertUnitsService.value(massFlow).from(settings.steamMassFlowMeasurement).to('tonne');
    let convertedEnthalpy: number = this.convertUnitsService.value(specificEnthalpy).from(settings.steamSpecificEnthalpyMeasurement).to('kJkg');
    let energy: number = convertedMassFlow * convertedEnthalpy;
    return energy;
  }

  initLosses(): SSMTLosses {
    let losses: SSMTLosses = {
      stack: 0,
      blowdown: 0,
      highPressureHeader: 0,
      mediumPressureHeader: 0,
      lowPressureHeader: 0,
      condensingTurbineEfficiencyLoss: 0,
      highToMediumTurbineEfficiencyLoss: 0,
      highToLowTurbineEfficiencyLoss: 0,
      mediumToLowTurbineEfficiencyLoss: 0,
      condensingLosses: 0,
      condensateLosses: 0,
      lowPressureVentLoss: 0,
      condensateFlashTankLoss: 0,
      deaeratorVentLoss: 0,
      highPressureProcessLoss: 0,
      mediumPressureProcessLoss: 0,
      lowPressureProcessLoss: 0,
      fuelEnergy: 0,
      makeupWaterEnergy: 0,
      condensingTurbineUsefulEnergy: 0,
      highToMediumTurbineUsefulEnergy: 0,
      highToLowTurbineUsefulEnergy: 0,
      mediumToLowTurbineUsefulEnergy: 0
    }
    return losses;
  }
}
