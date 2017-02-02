interface Id {
  AgencyId: string;
  Name: string;
  MC: boolean;
  Max: number;
  Parent: string;
}

interface Fill {
  x: number;
  y: number;
  w: number;
  h: number;
  clr: number;
}

interface TextRun {
  T: string;
  S: number;
  TS: number[];
}

interface Text {
  x: number;
  y: number;
  w: number;
  sw: number;
  clr: number;
  A: string;
  R: TextRun[];
}

interface Page {
  Height: number;
  HLines: any[];
  VLines: any[];
  Fills: Fill[];
  Texts: Text[];
  Fields: any[];
  Boxsets: any[];
}

interface FormImage {
  Transcoder: string;
  Agency: string;
  Id: Id;
  Pages: Page[];
  Width: number;
}

interface Pdf {
  formImage: FormImage;
}
