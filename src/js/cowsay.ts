import * as cowsayM from "cowsay";
import {IOptions} from "cowsay";

export function cowsay(option: IOptions) {
    console.log(cowsayM.say(option));
}

export function cowthink(option: IOptions) {
    console.log(cowsayM.think(option));
}
