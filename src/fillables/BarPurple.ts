import {Bar} from "@/fillables/Bar";

export class BarPurple extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with purple", Bar.colors.purple);
  }
}
