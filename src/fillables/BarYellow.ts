import {Bar} from "@/fillables/Bar";

export class BarYellow extends Bar {
  constructor(params: any = {}) {
    super(params, "A bar that fills with yellow.", Bar.colors.yellow);
  }
}
