import {Key} from "@/keyboards/Key";

export class Keyboard {

  keys: [Key[]];
  keyHeight: number;

  constructor(params: any){
    const { keys, keyHeight } = params;
    this.keys = keys || [[]];
    this.keyHeight = keyHeight || 50;
  }

}
