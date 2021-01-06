export class Comment {

  constructor(by: string, text: string, time: string) {
    this.by = by;
    this.text = text;
    this.time = time;
  }

  by: string;
  id: number;
  text: string;
  parent: number;
  time: string;
  deleted: boolean;
  kids: number[];
  type: string;
}
