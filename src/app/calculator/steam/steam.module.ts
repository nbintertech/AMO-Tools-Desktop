import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamPropertiesModule } from './steam-properties/steam-properties.module';
import { SteamService } from "./steam.service";
import { SaturatedPropertiesModule } from "./saturated-properties/saturated-properties.module";
import { StackLossModule } from './stack-loss/stack-loss.module';
import { HeatLossModule } from './heat-loss/heat-loss.module';
import { BoilerModule } from './boiler/boiler.module';
import { FlashTankModule } from './flash-tank/flash-tank.module';
import { PrvModule } from './prv/prv.module';
import { DeaeratorModule } from './deaerator/deaerator.module';
import { HeaderModule } from './header/header.module';
import { TurbineModule } from './turbine/turbine.module';
import { ConvertSteamService } from './convert-steam.service';
import { BoilerBlowdownRateModule } from './boiler-blowdown-rate/boiler-blowdown-rate.module';
import { SteamListComponent } from './steam-list/steam-list.component';
import { RouterModule } from '@angular/router';
import { SteamReductionModule } from './steam-reduction/steam-reduction.module';


@NgModule({
  imports: [
    CommonModule,
    SteamPropertiesModule,
    SaturatedPropertiesModule,
    StackLossModule,
    HeatLossModule,
    BoilerModule,
    FlashTankModule,
    PrvModule,
    DeaeratorModule,
    HeaderModule,
    TurbineModule,
    BoilerBlowdownRateModule,
    SteamReductionModule,
    RouterModule
  ],
  declarations: [
    SteamListComponent
  ],
  exports: [
    SteamListComponent
  ],
  providers: [
    SteamService,
    ConvertSteamService
  ]
})
export class SteamModule { }
