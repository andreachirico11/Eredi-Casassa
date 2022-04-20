export interface IData {
  oggetto: string;
  quantità: number;
  prezzo: number;
  id?: string;
}

export interface IFirebaseData {
  [key: string]: {
    oggetto: string;
    quantità: number;
    prezzo: number;
  };
}
