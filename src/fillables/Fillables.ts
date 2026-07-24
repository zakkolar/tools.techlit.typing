import {BarRed} from "@/fillables/BarRed";
import {BarOrange} from "@/fillables/BarOrange";
import {BarYellow} from "@/fillables/BarYellow";
import {BarGreen} from "@/fillables/BarGreen";
import {BarBlue} from "@/fillables/BarBlue";
import {BarPurple} from "@/fillables/BarPurple";
import {BarRandom} from "@/fillables/BarRandom";
import {Skyscraper} from "@/fillables/Skyscraper";


export enum FillableTypes {
  RED_BAR = "RED_BAR",
  ORANGE_BAR = "ORANGE_BAR",
  YELLOW_BAR = "YELLOW_BAR",
  GREEN_BAR = "GREEN_BAR",
  BLUE_BAR = "BLUE_BAR",
  PURPLE_BAR = "PURPLE_BAR",
  RANDOM_BAR = "RANDOM_BAR",
  SKYSCRAPER = "SKYSCRAPER",
}



export const getFillableConstructor = (mode:FillableTypes) => {
  switch(mode) {
    case FillableTypes.RED_BAR:
      return BarRed;
    case FillableTypes.ORANGE_BAR:
      return BarOrange;
    case FillableTypes.YELLOW_BAR:
      return BarYellow;
    case FillableTypes.GREEN_BAR:
      return BarGreen;
    case FillableTypes.BLUE_BAR:
      return BarBlue;
    case FillableTypes.PURPLE_BAR:
      return BarPurple;
    case FillableTypes.RANDOM_BAR:
      return BarRandom;
    case FillableTypes.SKYSCRAPER:
      return Skyscraper;
    default:
      return BarGreen;
  }
}

