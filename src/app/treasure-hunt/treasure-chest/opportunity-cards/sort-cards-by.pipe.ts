import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { OpportunityCardData } from './opportunity-cards.service';
import { SortCardsService } from './sort-cards.service';

@Pipe({
  name: 'sortCardsBy',
  pure: false
})
export class SortCardsByPipe implements PipeTransform {

  constructor(private sortCardsService: SortCardsService) {

  }

  transform(value: Array<OpportunityCardData>, sortByData: SortCardsData): Array<OpportunityCardData> {
    // if (sortByData.utilityType != 'All') {
    //   value = _.filter(value, (item: OpportunityCardData) => { return _.includes(item.utilityType, sortByData.utilityType) });
    // }
    // if (sortByData.calculatorType != 'All') {
    //   value = _.filter(value, (item: OpportunityCardData) => { return _.includes(item.opportunityType, sortByData.calculatorType) });
    // }
    // if (sortByData.teams.length != 0) {
    //   value = _.filter(value, (item: OpportunityCardData) => { return _.includes(sortByData.teams, item.teamName) });
    // }
    // if (sortByData.equipments.length != 0) {
    //   value = _.filter(value, (item: OpportunityCardData) => {
    //     if (item.opportunitySheet) {
    //       return _.includes(sortByData.equipments, item.opportunitySheet.equipment);
    //     } else {
    //       return false;
    //     }
    //   });
    // }
    // let direction: string = 'desc';
    // if (sortByData.sortBy == 'teamName' || sortByData.sortBy == 'name') {
    //   direction = 'asc';
    // }
    // value = _.orderBy(value, [sortByData.sortBy], direction);
    value = this.sortCardsService.sortCards(value, sortByData);
    return value;
  }

}


export interface SortCardsData {
  sortBy: string;
  teams: Array<string>;
  equipments: Array<{ display: string, value: string }>;
  utilityType: string;
  calculatorType: string;
}
