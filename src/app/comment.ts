export class Comment {
  by: string;
  id: number;
  text: string;
  parent: number;
  time: string;
  kids: number[];
  deleted: boolean;
  type: string;
}
