export class Comment {
  by: string;
  id: number;
  text: string;
  parent: number;
  time: string;
  deleted: boolean;
  kids: number[];
  type: string;
}
