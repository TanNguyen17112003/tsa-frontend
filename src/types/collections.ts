export interface Collection {
  id: string;
  name: string;
  code: string;
  circa: string;
  created_at: string;
  user_id: string;
}

export interface CollectionDetail extends Collection {}

export const initialCollection: CollectionDetail = {
  id: "",
  name: "",
  code: "",
  circa: "",
  created_at: "",
  user_id: "",
};
