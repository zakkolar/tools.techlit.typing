import {Keyboard} from "@/keyboards/Keyboard";
import {SpecialKey} from "@/keyboards/SpecialKey";
import {TypableKey} from "@/keyboards/TypableKey";

export const Chromebook = new Keyboard({
  keys: [
    [
      new TypableKey({label: ["~","`"]}),
      new TypableKey({label: ["!","1"]}),
      new TypableKey({label: ["@","2"]}),
      new TypableKey({label: ["#","3"]}),
      new TypableKey({label: ["$","4"]}),
      new TypableKey({label: ["%","5"]}),
      new TypableKey({label: ["^","6"]}),
      new TypableKey({label: ["&","7"]}),
      new TypableKey({label: ["*","8"]}),
      new TypableKey({label: ["(","9"]}),
      new TypableKey({label: [")","0"]}),
      new TypableKey({label: ["_","-"]}),
      new TypableKey({label: ["+","="]}),
      new SpecialKey({label: "backspace", width: 2}),
    ],
    [
      new SpecialKey({label: "tab", width: 1.75 }),
      new TypableKey({label: "q"}),
      new TypableKey({label: "w"}),
      new TypableKey({label: "e"}),
      new TypableKey({label: "r"}),
      new TypableKey({label: "t"}),
      new TypableKey({label: "y"}),
      new TypableKey({label: "u"}),
      new TypableKey({label: "i"}),
      new TypableKey({label: "o"}),
      new TypableKey({label: "p"}),
      new TypableKey({label: ["{","["]}),
      new TypableKey({label: ["}","]"]}),
      new TypableKey({label: ["|","\\"]}),
    ],
    [
      new SpecialKey({label: "search", width:2}),
      new TypableKey({label: "a"}),
      new TypableKey({label: "s"}),
      new TypableKey({label: "d"}),
      new TypableKey({label: "f"}),
      new TypableKey({label: "g"}),
      new TypableKey({label: "h"}),
      new TypableKey({label: "j"}),
      new TypableKey({label: "k"}),
      new TypableKey({label: "l"}),
      new TypableKey({label: [":",";"]}),
      new TypableKey({label: ["\"","'"]}),
      new SpecialKey({label: "enter", width: 2, hasOutput: false})
    ],
    [
      new SpecialKey({label: "shift", width:2.75, hasOutput: false}),
      new TypableKey({label:"z"}),
      new TypableKey({label:"x"}),
      new TypableKey({label:"c"}),
      new TypableKey({label:"v"}),
      new TypableKey({label:"b"}),
      new TypableKey({label:"n"}),
      new TypableKey({label:"m"}),
      new TypableKey({label:["<",","]}),
      new TypableKey({label:[">","."]}),
      new TypableKey({label:["?","/"]}),
      new SpecialKey({label: "shift", width: 2.75})
    ]

  ]
});
