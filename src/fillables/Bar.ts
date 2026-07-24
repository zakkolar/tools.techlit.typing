import {Fillable} from "@/fillables/Fillable";
export abstract class Bar extends Fillable {

  background: string;

  static colors = {
    red: '#ff4d3c',
    orange: '#ff8d3c',
    yellow: '#ffd83c',
    green: '#6bff02',
    blue: '#029eff',
    purple: '#9f38ff',
  }

  constructor(params:any = {}, description: string, background: string) {
    super(params, description, 'filled', 'bar | bars');
    this.background = background;

  }

  css(): string {
    return `
      <style>
      .bar {
        height: 100px;
        width: 30px;
        position: relative;
        border-style: solid;
        float: left;
        margin: 5px;
      }

      .bar .fill {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
      </style>
    `
  }

  render(): string {
    return `
         <div class="bar">
            <div class="fill" style="top: ${(100 - (this.contents/this.capacity * 100))}%; background: ${this.background};"></div>
          </div>

    `;
  }

}
