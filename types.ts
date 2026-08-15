export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "Alimentação"
  | "Transporte"
  | "Salário"
  | "Lazer"
  | "Moradia";

export interface Transaction{
    id: string;
    description: string;
    value: number;
    type: TransactionType;
    category: TransactionCategory;
    date: Date;
}
