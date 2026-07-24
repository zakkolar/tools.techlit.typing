import {Bar} from "@/fillables/Bar";

export class BarGreen extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with green.", Bar.colors.green);
  }
}
