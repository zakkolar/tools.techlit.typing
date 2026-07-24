import {Bar} from "@/fillables/Bar";

export class BarRed extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with red.", Bar.colors.red);
  }
}
