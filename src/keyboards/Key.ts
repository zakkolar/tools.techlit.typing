export class Key {

  label: string;
  width: number;
  hasOutput: boolean;

  constructor(params: any) {
    const {
      label,
      width = 1,
      hasOutput = true
    } = params;

    this.label = label;
    this.width = width;
    this.hasOutput = hasOutput;


  }
}
