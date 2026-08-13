export class Key {

  label: string;
  width: number;
  hasOutput: boolean;
  hand?: 'left' | 'right';

  constructor(params: any) {
    const {
      label,
      width = 1,
      hasOutput = true,
      hand
    } = params;

    this.label = label;
    this.width = width;
    this.hasOutput = hasOutput;
    this.hand = hand;


  }
}
