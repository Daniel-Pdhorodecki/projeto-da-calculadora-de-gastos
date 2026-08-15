import type { Transaction, TransactionType, TransactionCategory } from "./types.js";

export class TransactionStore {
private transactions: Transaction[] = [];

constructor() {
    this.transactions = this.load();
}

private save(): void {
            localStorage.setItem("transactions", JSON.stringify(this.transactions));
}

private load(): Transaction[] {
    const raw = localStorage.getItem("transactions");
    if (!raw) {
        return [];
    }
    return JSON.parse(raw);
}


  

addTransaction(description: string, value: number, type: TransactionType, category: TransactionCategory, date: Date): void{
const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        description,
        value,
        type,
        category,
        date,
     };
        this.transactions.push(newTransaction);
        this.save();
    }
    removeTransaction(id: string): void {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
        this.save();
    }

    updateTransaction(id:string, description: string, value: number, type: TransactionType, category: TransactionCategory): void {
        const transaction = this.transactions.find((t)=> t.id === id);
        if (transaction) {
            transaction.description = description;
            transaction.value = value;
            transaction.type = type;
            transaction.category = category;
            this.save();
        }
    }

    getAll(): Transaction[] {
        return [...this.transactions];
    }
    getBalance(): number {
        let balance = 0;
        for (const transaction of this.transactions) {
            if (transaction.type === "income") {
                balance += transaction.value;
            }else {
                balance -= transaction.value;
            }
        }
        return balance;
    }

        getTotalByType(type: TransactionType): number {
            let total = 0;

            for (const transaction of this.transactions) {
                if (transaction.type === type){
                    total += transaction.value;
                }
            }
            return total;
        }
    }

  
