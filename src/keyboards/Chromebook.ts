import {Keyboard} from "@/keyboards/Keyboard";
import {SpecialKey} from "@/keyboards/SpecialKey";
import {TypableKey} from "@/keyboards/TypableKey";

export const Chromebook = new Keyboard({
  keys: [
    [
      new TypableKey({label: ["~","`"], hand: 'left'}),
      new TypableKey({label: ["!","1"], hand: 'left'}),
      new TypableKey({label: ["@","2"], hand: 'left'}),
      new TypableKey({label: ["#","3"], hand: 'left'}),
      new TypableKey({label: ["$","4"], hand: 'left'}),
      new TypableKey({label: ["%","5"], hand: 'left'}),
      new TypableKey({label: ["^","6"], hand: 'right'}),
      new TypableKey({label: ["&","7"], hand: 'right'}),
      new TypableKey({label: ["*","8"], hand: 'right'}),
      new TypableKey({label: ["(","9"], hand: 'right'}),
      new TypableKey({label: [")","0"], hand: 'right'}),
      new TypableKey({label: ["_","-"], hand: 'right'}),
      new TypableKey({label: ["+","="], hand: 'right'}),
      new SpecialKey({label: "backspace", width: 2}),
    ],
    [
      new SpecialKey({label: "tab", width: 1.75 }),
      new TypableKey({label: "q", hand: 'left'}),
      new TypableKey({label: "w", hand: 'left'}),
      new TypableKey({label: "e", hand: 'left'}),
      new TypableKey({label: "r", hand: 'left'}),
      new TypableKey({label: "t", hand: 'left'}),
      new TypableKey({label: "y", hand: 'right'}),
      new TypableKey({label: "u", hand: 'right'}),
      new TypableKey({label: "i", hand: 'right'}),
      new TypableKey({label: "o", hand: 'right'}),
      new TypableKey({label: "p", hand: 'right'}),
      new TypableKey({label: ["{","["], hand: 'right'}),
      new TypableKey({label: ["}","]"], hand: 'right'}),
      new TypableKey({label: ["|","\\"], hand: 'right'}),
    ],
    [
      new SpecialKey({label: "search", width:2}),
      new TypableKey({label: "a", hand: 'left'}),
      new TypableKey({label: "s", hand: 'left'}),
      new TypableKey({label: "d", hand: 'left'}),
      new TypableKey({label: "f", hand: 'left'}),
      new TypableKey({label: "g", hand: 'left'}),
      new TypableKey({label: "h", hand: 'right'}),
      new TypableKey({label: "j", hand: 'right'}),
      new TypableKey({label: "k", hand: 'right'}),
      new TypableKey({label: "l", hand: 'right'}),
      new TypableKey({label: [":",";"], hand: 'right'}),
      new TypableKey({label: ["\"","'"], hand: 'right'}),
      new SpecialKey({label: "enter", width: 2, hasOutput: false})
    ],
    [
      new SpecialKey({label: "shift", width:2.75, hasOutput: false, hand: 'left'}),
      new TypableKey({label:"z", hand: 'left'}),
      new TypableKey({label:"x", hand: 'left'}),
      new TypableKey({label:"c", hand: 'left'}),
      new TypableKey({label:"v", hand: 'left'}),
      new TypableKey({label:"b", hand: 'left'}),
      new TypableKey({label:"n", hand: 'right'}),
      new TypableKey({label:"m", hand: 'right'}),
      new TypableKey({label:["<",","], hand: 'right'}),
      new TypableKey({label:[">","."], hand: 'right'}),
      new TypableKey({label:["?","/"], hand: 'right'}),
      new SpecialKey({label: "shift", width: 2.75, hand: 'right'})
    ]

  ]
});
