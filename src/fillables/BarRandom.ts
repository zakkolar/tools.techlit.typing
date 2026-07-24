import {Bar} from "@/fillables/Bar";

export class BarRandom extends Bar {
  constructor(params: any = {}) {
    const colors = [Bar.colors.red, Bar.colors.yellow, Bar.colors.green, Bar.colors.blue, Bar.colors.purple];
    super(params, "A bar that fills with a randomly selected color. Each bar will be a separate color.", colors[Math.floor(Math.random() * 100000) % colors.length]!);
  }
}
