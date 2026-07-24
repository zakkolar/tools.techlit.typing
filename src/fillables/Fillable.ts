export class Fillable {
  contents: number
  capacity: number
  verb: string
  noun: string

  constructor(params: any = {}) {
    const { capacity = 10 } = params
    this.capacity = capacity
    this.contents = 0
    this.verb = 'filled'
    this.noun = 'bar | bars'
  }

  fill(amount: number = 1) {
    if (!this.isFull()) {
      this.contents += amount
    }
  }

  unfill(amount: number = 1) {
    if (!this.isFull() && this.contents > 0) {
      this.contents -= amount
    }
  }

  isFull() {
    return this.contents === this.capacity
  }

  css(): string {
    return `
      <style>
      .fillable-bar {
        height: 100px;
        width: 28px;
        position: relative;
        border: 1px solid var(--color-rule);
        border-radius: 6px;
        background: var(--color-paper-raised);
        margin: 4px;
        float: left;
        overflow: hidden;
      }

      .fillable-bar .fill {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--color-blue);
      }
      </style>
    `
  }

  render(): string {
    const percentFilled = (this.contents / this.capacity) * 100

    return `
      <div class="fillable-bar">
        <div class="fill" style="height: ${percentFilled}%;"></div>
      </div>
    `
  }
}
