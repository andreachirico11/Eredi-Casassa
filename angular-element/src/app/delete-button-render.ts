import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DeleteEventService } from './delete-event.service';

@Component({
  selector: 'delete button',
  template: `
    <button class="delete" (click)="onDeleteRow()">CAncella</button>
  `,
  styles: [
    `
      button.delete {
        font-size: 10px;
        padding: 0;
        border: 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteButtonRender implements ICellRendererAngularComp {
  private params!: ICellRendererParams;

  constructor(private deleteService: DeleteEventService) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onDeleteRow() {
    this.deleteService.passIdToDelete(this.params.data);
  }
}
