//@flow

type HTMLInputEvent = {
  target: HTMLInputElement
};

type Expression = {
  eval: (bind: {[id:string]:number|string}) => any;
}

declare module mathjs {
  declare function compile(expr:string):Expression;
};
