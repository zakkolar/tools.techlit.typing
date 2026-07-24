export abstract class Fillable {
  contents: number;
  capacity: number;
  description: string;
  verb: string;
  noun: string;

  constructor(params:any = {}, description:string, verb: string, noun: string) {
    const {capacity = 10} = params;
    this.capacity = capacity;
    this.contents = 0;
    this.description = description;
    this.verb = verb;
    this.noun = noun;
  }

  fill(amount: number = 1){
    if(!this.isFull()){
      this.contents += amount;
    }
  }

  unfill(amount: number = 1){
    if(!this.isFull() && this.contents > 0){
      this.contents -= amount;
    }
  }

  isFull(){
    return this.contents === this.capacity;
  }

  abstract render(): string;

  abstract css(): string;

}
