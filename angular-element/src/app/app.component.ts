import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  CellValueChangedEvent,
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { IData, IFirebaseData } from './Interfaces';
import { ParsersService } from './parsers-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    '../../node_modules/ag-grid-community/dist/styles/ag-grid.min.css',
    '../../node_modules/ag-grid-community/dist/styles/ag-theme-material.min.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  private dbData!: IFirebaseData;

  columnDefs: ColDef[] = [
    { field: 'oggetto', editable: true },
    { field: 'quantità', editable: true },
    { field: 'prezzo', editable: true },
    { field: 'id', hide: true, suppressColumnsToolPanel: true },
  ];

  rowData: IData[] = [];

  @Input() set data(d: string) {
    this.dbData = JSON.parse(d) as IFirebaseData;
    this.rowData = this.parsers.parseToTable(this.dbData);
  }

  @Output() newLineAdded = new EventEmitter<IData>();

  @Output() lineUpdated = new EventEmitter<IFirebaseData>();

  constructor(private parsers: ParsersService) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onCellValueChanged(ev: CellValueChangedEvent) {
    if (ev.rowIndex !== null && ev.rowIndex >= 0) {
      this.lineUpdated.emit(this.parsers.parseToFirebase(this.getUpdatedData(ev)));
    }
  }

  private getUpdatedData(ev: CellValueChangedEvent) {
    const rowUpdated = this.rowData[ev.rowIndex as number];
    return { ...rowUpdated, prezzo: Number(rowUpdated.prezzo) };
  }
}