export type ProductType = {
  id: string;
  name: string;
  unit_amount: number | null;
  image: string;
  description: string | null;
  metadata: {
    About: string;
  };
}
