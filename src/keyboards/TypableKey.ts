import {Key} from "@/keyboards/Key";

export class TypableKey extends Key {
  constructor(params: any) {
    params.hasOutput = true;
    super(params);
  }
}
