import * as cowsayM from "cowsay";
import {IOptions} from "cowsay";

const Cows = {
    dragon:
        "      $thoughts                    / \\\\  //\\\\\n" +
        "       $thoughts    |\\\\___/|      /   \\\\//  \\\\\\\\\n" +
        "            /$eye  $eye  \\\\__  /    //  | \\\\ \\\\    \n" +
        "           /     /  \\\\/_/    //   |  \\\\  \\\\  \n" +
        "           \\@_^_\\@'/   \\\\/_   //    |   \\\\   \\\\ \n" +
        "           //_^_/     \\\\/_ //     |    \\\\    \\\\\n" +
        "        ( //) |        \\\\///      |     \\\\     \\\\\n" +
        "      ( / /) _|_ /   )  //       |      \\\\     _\\\\\n" +
        "    ( // /) '/,_ _ _/  ( ; -.    |    _ _\\\\.-~        .-~~~^-.\n" +
        "  (( / / )) ,-{        _      `-.|.-~-.           .~         `.\n" +
        " (( // / ))  '/\\\\      /                 ~-. _ .-~      .-~^-.  \\\\\n" +
        " (( /// ))      `.   {            }                   /      \\\\  \\\\\n" +
        "  (( / ))     .----~-.\\\\        \\\\-'                 .~         \\\\  `. \\\\^-.\n" +
        "             ///.----..>        \\\\             _ -~             `.  ^-`  ^-_\n" +
        "               ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~\n" +
        "                                                                  /.-~",
};

type Opt = {
    text: string;
    f: keyof typeof Cows;
} & IOptions;

export function cowsay(option: Opt) {
    console.log(cowsayM.say({...option, cow: Cows[option.f]}));
}

export function cowthink(option: Opt) {
    console.log(cowsayM.think({...option, cow: Cows[option.f]}));
}
