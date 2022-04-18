import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
} from 'ag-grid-community';

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
  private dbData: any;

  columnDefs: ColDef[] = [{ field: 'oggetto' }, { field: 'quantità' }, { field: 'prezzo' }];

  rowData: any[] = [];

  @Input() set data(d: any) {
    this.dbData = JSON.parse(d);
    this.rowData = this.parseToTable(this.dbData);
  }

  @Output() newLineAdded = new EventEmitter<any>();

  forceAddDataMock() {
    this.newLineAdded.emit(
      JSON.stringify({ oggetto: 'Toyota', quantità: 'Celica', prezzo: 35000 })
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  parseToTable(d: any) {
    return Object.keys(d).map((k) => d[k]) as any[];
  }
}
