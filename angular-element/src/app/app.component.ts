import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CellValueChangedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { DeleteButtonRender } from './delete-button-render';
import { DeleteEventService } from './delete-event.service';
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
export class AppComponent implements OnDestroy {
  private gridApi!: GridApi;
  private dbData!: IFirebaseData;

  components = {
    delete: DeleteButtonRender,
  };

  columnDefs: ColDef[] = [
    { field: 'oggetto', editable: true },
    { field: 'quantità', editable: true },
    { field: 'prezzo', editable: true },
    { field: 'id', hide: true, suppressColumnsToolPanel: true },
    { field: 'azione', cellRenderer: 'delete' },
  ];

  rowData: IData[] = [];

  @Input() set data(d: string) {
    this.dbData = JSON.parse(d) as IFirebaseData;
    this.rowData = this.parsers.parseToTable(this.dbData);
  }

  @Output() newLineAdded = new EventEmitter<IData>();

  @Output() lineUpdated = new EventEmitter<IFirebaseData>();

  @Output() rowDelete = new EventEmitter<string>();

  private sub!: Subscription;

  constructor(private parsers: ParsersService, private deleteService: DeleteEventService) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.sub = this.deleteService.idToDelete.subscribe((id) => {
      this.onDeleteRow(id);
    });
  }

  onCellValueChanged(ev: CellValueChangedEvent) {
    if (ev.data.id) {
      this.lineUpdated.emit(this.parsers.parseToFirebase(ev.data));
    } else {
      this.newLineAdded.emit(this.parsers.parseToFirebaseObj(ev.data));
    }
  }

  onAddRow() {
    this.gridApi.applyTransaction({
      add: [
        {
          oggetto: '',
          quantità: 0,
          prezzo: 0,
          id: null,
        },
      ],
    });
  }

  private onDeleteRow(dataToDelete: IData) {
    this.gridApi.applyTransaction({
      remove: [dataToDelete],
    });
    this.rowDelete.emit(dataToDelete.id);
  }
}
