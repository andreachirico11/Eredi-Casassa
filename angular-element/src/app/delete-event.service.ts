import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IData } from './Interfaces';

@Injectable({ providedIn: 'root' })
export class DeleteEventService {
  private _idToDelete: Subject<IData> = new Subject();

  get idToDelete() {
    return this._idToDelete.asObservable();
  }

  passIdToDelete(d: IData) {
    this._idToDelete.next(d);
  }
}
