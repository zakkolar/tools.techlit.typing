import {Bar} from "@/fillables/Bar";

export class BarBlue extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with blue.", Bar.colors.blue);
  }
}
