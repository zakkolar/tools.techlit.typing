import {Bar} from "@/fillables/Bar";

export class BarOrange extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with orange.", Bar.colors.orange);
  }
}
