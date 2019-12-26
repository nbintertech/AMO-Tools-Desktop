import { Component, OnInit } from '@angular/core';
import { VisualizeService, GraphDataObj } from '../visualize.service';
import { Subscription } from 'rxjs';
import { LogToolService, LogToolField } from '../../log-tool.service';

@Component({
  selector: 'app-visualize-menu',
  templateUrl: './visualize-menu.component.html',
  styleUrls: ['./visualize-menu.component.css']
})
export class VisualizeMenuComponent implements OnInit {

  graphDataSubscription: Subscription;
  graphData: Array<GraphDataObj>;
  selectedGraphDataSub: Subscription;
  selectedGraphData: GraphDataObj;
  xDataFieldDropdown: boolean = false;
  yDataFieldDropdown: boolean = false;
  graphTypeDropdown: boolean = false;
  dataFields: Array<LogToolField>;

  graphTypes: Array<{ label: string, value: string }> = [{ value: 'scatter', label: 'Scatter Plot' }, { value: 'bar', label: 'Histogram' }]
  showScatterLines: boolean = false;
  showScatterMarkers: boolean = true;
  constructor(private visualizeService: VisualizeService, private logToolService: LogToolService) { }


  ngOnInit() {
    this.dataFields = this.logToolService.fields.filter((field) => { return field.useField == true });
    this.graphDataSubscription = this.visualizeService.graphData.subscribe(graphData => {
      this.graphData = graphData;
    });
    this.selectedGraphDataSub = this.visualizeService.selectedGraphData.subscribe(selectedGraphData => {
      this.selectedGraphData = selectedGraphData;
      this.setScatterBools()
    });
  }

  ngOnDestroy() {
    this.selectedGraphDataSub.unsubscribe()
    this.graphDataSubscription.unsubscribe();
  }

  setScatterBools() {
    if (this.selectedGraphData.scatterPlotMode == 'lines+markers') {
      this.showScatterMarkers = true;
      this.showScatterLines = true;
    } else if (this.selectedGraphData.scatterPlotMode == 'markers') {
      this.showScatterMarkers = true;
      this.showScatterLines = false;
    } else if (this.selectedGraphData.scatterPlotMode == 'lines') {
      this.showScatterLines = true;
      this.showScatterMarkers = false;
    }
  }

  toggleXDataFieldDropdown() {
    this.xDataFieldDropdown = !this.xDataFieldDropdown;
  }

  toggleYDataFieldDropdown() {
    this.yDataFieldDropdown = !this.yDataFieldDropdown;
  }

  setXDataField(dataField: LogToolField) {
    this.visualizeService.updateSelectedXDataField(dataField);
    this.xDataFieldDropdown = false;
  }

  setYDataField(dataField: LogToolField) {
    this.visualizeService.updateSelectedYDataField(dataField);
    this.yDataFieldDropdown = false;
  }

  setGraphType(newGraphType: { label: string, value: string }) {
    this.visualizeService.updateGraphType(newGraphType);
    this.graphTypeDropdown = false;
  }

  toggleGraphType() {
    this.graphTypeDropdown = !this.graphTypeDropdown;
  }

  toggleScatterLines() {
    this.showScatterLines = !this.showScatterLines;
    this.setScatterPlotMode();
  }

  toggleScatterMarkers() {
    this.showScatterMarkers = !this.showScatterMarkers;
    this.setScatterPlotMode();
  }

  setScatterPlotMode() {
    if (this.showScatterMarkers == true && this.showScatterLines == true) {
      this.visualizeService.updateGraphScatterPlotMode('lines+markers');
    } else if (this.showScatterMarkers == true) {
      this.visualizeService.updateGraphScatterPlotMode('markers');
    } else if (this.showScatterLines == true) {
      this.visualizeService.updateGraphScatterPlotMode('lines');
    }
  }


}
