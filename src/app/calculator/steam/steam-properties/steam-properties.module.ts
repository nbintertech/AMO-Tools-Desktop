import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SteamPropertiesGraphComponent } from './steam-properties-graph/steam-properties-graph.component';
import { SteamPropertiesComponent } from './steam-properties.component';
import { SteamPropertiesFormComponent } from './steam-properties-form/steam-properties-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SteamPropertiesHelpComponent } from './steam-properties-help/steam-properties-help.component';
import { SteamPropertiesTableComponent } from './steam-properties-table/steam-properties-table.component';
import { SteamPropertiesPhGraphComponent } from './steam-properties-ph-graph/steam-properties-ph-graph.component';
import { SimpleTooltipModule } from '../../../shared/simple-tooltip/simple-tooltip.module';
import { SharedPipesModule } from '../../../shared/shared-pipes/shared-pipes.module';
import { ExportableResultsTableModule } from '../../../shared/exportable-results-table/exportable-results-table.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleTooltipModule,
    SharedPipesModule,
    ExportableResultsTableModule
  ],
  declarations: [
    SteamPropertiesGraphComponent,
    SteamPropertiesComponent,
    SteamPropertiesFormComponent,
    SteamPropertiesHelpComponent,
    SteamPropertiesTableComponent,
    SteamPropertiesPhGraphComponent
  ],
  exports: [
    SteamPropertiesComponent
  ]
})
export class SteamPropertiesModule { }
