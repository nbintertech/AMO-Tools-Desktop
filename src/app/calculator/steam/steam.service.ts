import { Injectable } from '@angular/core';
import { SaturatedPropertiesInput, SaturatedPropertiesOutput, SteamPropertiesInput, SteamPropertiesOutput, BoilerInput, BoilerOutput } from "../../shared/models/steam";
import { ConvertUnitsService } from "../../shared/convert-units/convert-units.service";
import { Settings } from "../../shared/models/settings";

declare var steamAddon: any;

@Injectable()
export class SteamService {


  constructor(private convertUnitsService: ConvertUnitsService) { }

  test() {
    console.log(steamAddon);
  }

  convertSteamPropertiesQuantityValue(steamPropertiesInput: SteamPropertiesInput, settings: Settings, forInput: boolean, output?: SteamPropertiesOutput) {
    if (forInput === true) {
      if (steamPropertiesInput.thermodynamicQuantity === 0) { // convert temperature to kelvin
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamTemperatureMeasurement).to('C') + 273.15;
      } else if (steamPropertiesInput.thermodynamicQuantity === 1) { // convert specific Enthalpy
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamSpecificEnthalpyMeasurement).to('kJkg');
      } else if (steamPropertiesInput.thermodynamicQuantity === 2) { // convert specific Entropy
        return this.convertUnitsService.value(steamPropertiesInput.quantityValue).from(settings.steamSpecificEntropyMeasurement).to('kJkgK');
      } else {
        return steamPropertiesInput.quantityValue;
      }
    }
    else {
      if (steamPropertiesInput.thermodynamicQuantity === 0) { // convert temperature back to original user-chosen unit
        output.temperature = this.convertUnitsService.value(steamPropertiesInput.quantityValue - 273.15).from('C').to(settings.steamTemperatureMeasurement);
        output.specificEntropy = this.convertUnitsService.value(output.specificEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.specificEnthalpy = this.convertUnitsService.value(output.specificEnthalpy).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
      } else if (steamPropertiesInput.thermodynamicQuantity === 1) { // convert specific Enthalpy
        output.specificEnthalpy = this.convertUnitsService.value(steamPropertiesInput.quantityValue).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
        output.specificEntropy = this.convertUnitsService.value(output.specificEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
      } else if (steamPropertiesInput.thermodynamicQuantity === 2) {
        output.specificEntropy = this.convertUnitsService.value(steamPropertiesInput.quantityValue).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
        output.specificEnthalpy = this.convertUnitsService.value(output.specificEnthalpy).from('kJkg').to(settings.steamSpecificEnthalpyMeasurement);
      } else {
        output.temperature = this.convertUnitsService.value(output.temperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);
      }
    }
  }

  steamProperties(steamPropertiesInput: SteamPropertiesInput, settings: Settings): SteamPropertiesOutput {
    let input: SteamPropertiesInput = steamPropertiesInput;
    input.pressure = this.convertUnitsService.value(input.pressure).from(settings.steamPressureMeasurement).to('MPa');
    input.quantityValue = this.convertSteamPropertiesQuantityValue(input, settings, true);

    let output: SteamPropertiesOutput = steamAddon.steamProperties(steamPropertiesInput);
    output.pressure = this.convertUnitsService.value(output.pressure).from('MPa').to(settings.steamPressureMeasurement);
    output.specificVolume = this.convertUnitsService.value(output.specificVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    this.convertSteamPropertiesQuantityValue(input, settings, false, output);
    return output;
  }

  saturatedProperties(saturatedPropertiesInput: SaturatedPropertiesInput, pressureOrTemperature: number, settings: Settings): SaturatedPropertiesOutput {
    let input = saturatedPropertiesInput;
    let output: SaturatedPropertiesOutput;

    if (pressureOrTemperature === 0) {
      input.saturatedPressure = this.convertUnitsService.value(input.saturatedPressure).from(settings.steamPressureMeasurement).to('MPa');
      output = steamAddon.saturatedPropertiesGivenPressure(input);
    } else {
      input.saturatedTemperature = this.convertUnitsService.value(input.saturatedTemperature).from(settings.steamTemperatureMeasurement).to('C') + 273.15;
      output = steamAddon.saturatedPropertiesGivenTemperature(input);
    }

    output.gasEntropy = this.convertUnitsService.value(output.gasEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);
    output.liquidEntropy = this.convertUnitsService.value(output.liquidEntropy).from('kJkgK').to(settings.steamSpecificEntropyMeasurement);

    output.saturatedPressure = this.convertUnitsService.value(output.saturatedPressure).from('MPa').to(settings.steamPressureMeasurement);
    output.saturatedTemperature = this.convertUnitsService.value(output.saturatedTemperature - 273.15).from('C').to(settings.steamTemperatureMeasurement);

    output.evaporationVolume = this.convertUnitsService.value(output.evaporationVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    output.gasVolume = this.convertUnitsService.value(output.gasVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);
    output.liquidVolume = this.convertUnitsService.value(output.liquidVolume).from('m3kg').to(settings.steamSpecificVolumeMeasurement);

    return output;
  }


  boiler(input?: BoilerInput): BoilerOutput {
    let dataTest: any = {
      deaeratorPressure : 10, combustionEfficiency : 85, blowdownRate : 2,
      steamPressure : 20, thermodynamicQuantity : 1, //1 is ENTHALPY
      quantityValue : 2000, steamMassFlow : 45
    }
    return steamAddon.boiler(dataTest);
  }

  deaerator() {

  }

  flashTank() {

  }

  header() {

  }

  heatLoss() {

  }
  prvWithDesuperheating() {

  }
  prvWithoutDesuperheating() {

  }
  saturatedPressure() {

  }

  saturatedTemperature() {

  }
  steamPropertiesData() {

  }
  turbine() {

  }

  getDisplayUnit(unit: string) {
    if (unit) {
      let dispUnit: string = this.convertUnitsService.getUnit(unit).unit.name.display;
      dispUnit = dispUnit.replace('(', '');
      dispUnit = dispUnit.replace(')', '');
      return dispUnit;
    }
  }

}
