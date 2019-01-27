/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
    children: FileNode[];
    filename: string;
    type: any;
  }

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any) {}
}