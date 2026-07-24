import {Fillable} from "@/fillables/Fillable";
export class Skyscraper extends Fillable {


  constructor(params:any = {}, ) {
    super(params, "A skyscraper that is built up as the user types more.", 'built', 'skyscraper | skyscrapers');

  }

  css(): string {
    const roomWidth = 2;
    const roomPadding = 4;
    const roomHeight = 4;

    const antennaHeight = 15;
    const antennaWidth = 1.5;

    const roomsAcross = (n:number, includeExtraRightPadding=false) => (roomWidth + roomPadding) * n + (includeExtraRightPadding ? 0 : roomPadding);
    const roomsHigh = (n:number, includeExtraBottomPadding=false) => (roomHeight + roomPadding) * n + (includeExtraBottomPadding ? 0 : roomPadding);

    return `<style>
      .skyscraper {
        height: ${roomsHigh(10, true) + antennaHeight}px;
        width: ${roomsAcross(5)}px;
        position: relative;
        float: left;
        margin: 5px;
        border-bottom: solid;
        border-color: #64929f;
      }

      .skyscraper .floor {
         position: absolute;
         background-color: #64929f;
         padding-right: ${roomPadding}px;
         padding-top: ${roomPadding}px;
         height: ${roomsHigh(1, true)}px;
      }

      .skyscraper.floor.one,
      .skyscraper.floor.two,
      .skyscraper.floor.three,
      .skyscraper.floor.four ,
      .skyscraper.floor.five  {
         left: 0;
         right: 0;
      }

      .skyscraper .floor.one {
         bottom: 0;
      }
      .skyscraper .floor.two {
         bottom: ${roomsHigh(1, true)}px;
      }

      .skyscraper .floor.three {
         bottom: ${roomsHigh(2, true)}px;
      }

      .skyscraper .floor.four {
         bottom: ${roomsHigh(3, true)}px;
      }

      .skyscraper .floor.five {
         bottom: ${roomsHigh(4, true)}px;
      }

      .skyscraper .floor.six,
       .skyscraper .floor.seven,
       .skyscraper .floor.eight{
        width: ${roomsAcross(3)}px;
        left: ${(roomsAcross(5) - roomsAcross(3))/2}px;
      }

      .skyscraper .floor.six {
         bottom: ${roomsHigh(5, true)}px;
      }

      .skyscraper .floor.seven {
         bottom: ${roomsHigh(6, true)}px;
      }

      .skyscraper .floor.eight {
         bottom: ${roomsHigh(7, true)}px;
      }


      .skyscraper .floor.nine,
      .skyscraper .floor.ten{
        width: ${roomsAcross(1)}px;
        left: ${(roomsAcross(5) - roomsAcross(1))/2}px;
      }

      .skyscraper .floor.nine{
        bottom: ${roomsHigh(8, true)}px;
      }


      .skyscraper .floor.ten{
        bottom: ${roomsHigh(9, true)}px;
      }

      .skyscraper .antenna {
         position: absolute;
         width: ${antennaWidth}px;
         height: ${antennaHeight}px;
         bottom: ${roomsHigh(10, true)}px;
         left: ${(roomsAcross(5) - antennaWidth)/2}px;
         background-color: black;
      }


      .skyscraper .window {
        float: left;
        margin-left: ${roomPadding}px;
        margin-bottom: ${roomPadding}px;
        width: ${roomWidth}px;
        height:${roomHeight}px;
        background-color: black;
      }
      </style>`
  }

  render(): string {

    const parts = [
      `<div class="floor one">
          ${'<div class="window"></div>'.repeat(5)}
      </div>`,
      `<div class="floor two">
          ${'<div class="window"></div>'.repeat(5)}
      </div>`,
      `<div class="floor three">
          ${'<div class="window"></div>'.repeat(5)}
      </div>`,
      `<div class="floor four">
          ${'<div class="window"></div>'.repeat(5)}
      </div>`,
      `<div class="floor five">
          ${'<div class="window"></div>'.repeat(5)}
      </div>`,
      `<div class="floor six">
          ${'<div class="window"></div>'.repeat(3)}
      </div>`,
      `<div class="floor seven">
          ${'<div class="window"></div>'.repeat(3)}
      </div>`,
      `<div class="floor eight">
          ${'<div class="window"></div>'.repeat(3)}
      </div>`,
      `<div class="floor nine">
          ${'<div class="window"></div>'.repeat(1)}
      </div>
      <div class="floor ten">
          ${'<div class="window"></div>'.repeat(1)}
      </div>`,
      `<div class="antenna">
      </div>`,

    ]

    return `
         <div class="skyscraper">
             ${parts.map(part => part).slice(0, Math.floor(this.contents/this.capacity * (parts.length))).join("\n")}
          </div>

    `;
  }

}
