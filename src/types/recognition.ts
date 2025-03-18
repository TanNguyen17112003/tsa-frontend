export interface Recognition {
  id: string;
  text: string;
  createdAt: Date;
}

export interface RecognitionDetail extends Recognition {}
