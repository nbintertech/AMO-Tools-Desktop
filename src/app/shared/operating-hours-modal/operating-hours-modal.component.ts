import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { OperatingHours } from '../models/operations';
import { OperatingHoursModalService } from './operating-hours-modal.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-operating-hours-modal',
  templateUrl: './operating-hours-modal.component.html',
  styleUrls: ['./operating-hours-modal.component.css'],
  animations: [
    trigger('modal', [
      state('show', style({
        top: '50px'
      })),
      transition('hide => show', animate('.5s ease-in')),
      transition('show => hide', animate('.5s ease-out'))
    ])
  ]
})
export class OperatingHoursModalComponent implements OnInit {
  @Output('emitClose')
  emitClose = new EventEmitter<boolean>();
  @Output('emitSave')
  emitSave = new EventEmitter<OperatingHours>();
  @Input()
  width: number;
  @Input()
  operatingHours: OperatingHours;
  @Input()
  showMinutesSeconds: boolean;

  showModal: string = 'hide';
  operatingHoursForm: FormGroup;
  constructor(private operatingHoursModalService: OperatingHoursModalService) { }

  ngOnInit() {
    setTimeout(() => {
      this.showModal = 'show';
    }, 100)
    if (!this.operatingHours) {
      this.operatingHours = {
        weeksPerYear: 52,
        daysPerWeek: 7,
        hoursPerDay: 24,
        minutesPerHour: 60,
        secondsPerMinute: 60,
        hoursPerYear: 8736
      };
    }
    this.operatingHoursForm = this.operatingHoursModalService.getFormFromObj(this.operatingHours);
    this.calculatHrsPerYear();
  }

  calculatHrsPerYear() {
    this.operatingHours = this.operatingHoursModalService.getObjectFromForm(this.operatingHoursForm);
  }

  addOne(control: FormControl) {
    let value: number = control.value + 1;
    control.patchValue(value);
    this.calculatHrsPerYear();
  }

  subtractOne(control: FormControl) {
    let value: number = control.value - 1;
    control.patchValue(value);
    this.calculatHrsPerYear();
  }

  close() {
    this.emitClose.emit(true);
  }

  save() {
    this.showModal = 'hide';
    setTimeout(() => {
      this.emitSave.emit(this.operatingHours);
    }, 500)
  }
}
