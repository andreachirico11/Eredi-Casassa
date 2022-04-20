import { Injectable } from '@angular/core';
import { IFirebaseData, IData } from './Interfaces';

@Injectable({ providedIn: 'root' })
export class ParsersService {
  parseToTable(d: IFirebaseData) {
    const output: IData[] = [];
    Object.keys(d).forEach((id) => {
      const { oggetto, quantità, prezzo } = d[id];
      output.push({ id, oggetto, quantità, prezzo });
    });
    return output;
  }
  parseToFirebase(data: IData) {
    const output: IFirebaseData = {};
    if (data.id) {
      const { oggetto, quantità, prezzo, id } = data;
      output[id] = { prezzo, oggetto, quantità };
    }
    return output;
  }
}
