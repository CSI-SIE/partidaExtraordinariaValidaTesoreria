import { Component } from '@angular/core';


export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$5,500.00', weight: 1.0079, symbol: 'H'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$6,900.00', weight: 4.0026, symbol: 'He'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$2,900.00', weight: 6.941, symbol: 'Li'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$93,200.00', weight: 9.0122, symbol: 'Be'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$85,000.00', weight: 10.811, symbol: 'B'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$74,500.00', weight: 12.0107, symbol: 'C'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$500.00', weight: 14.0067, symbol: 'N'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$900.00', weight: 15.9994, symbol: 'O'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$85,000.00', weight: 18.9984, symbol: 'F'},
  {position: 'HydrogenHydrogenHydrogenHydrogenHydrogenHydrogenHydrogen', name: '$600.00', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'capturaPartidaExtraordinaria';

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
