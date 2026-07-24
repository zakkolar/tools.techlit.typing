import {Key} from "@/keyboards/Key";

export class SpecialKey extends Key {
  constructor(params: any) {
    params.hasOutput = false;
    super(params);
  }
}
