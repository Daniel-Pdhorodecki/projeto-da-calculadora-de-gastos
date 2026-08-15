import { TransactionStore } from "./store.js";
import type { TransactionCategory, TransactionType } from "./types.js";

export function initUI(store: TransactionStore): void {    
let editingId: string | null = null;
const descriptionInput = document.createElement("input");
descriptionInput.type = "text";
descriptionInput.placeholder = "Descrição";

const valueInput = document.createElement("input");
valueInput.type = "number";
valueInput.placeholder = "Valor";

const typeSelect = document.createElement("select");
const incomeOption = document.createElement("option");
incomeOption.value = "income";
incomeOption.textContent = "Entrada";

const expenseOption = document.createElement("option");
expenseOption.value = "expense";
expenseOption.textContent = "Saída";

typeSelect.appendChild(incomeOption);
typeSelect.appendChild(expenseOption);

const categorySelect = document.createElement("select");
const categories: TransactionCategory[] = ["Alimentação", "Transporte", "Salário", "Lazer", "Moradia"];
categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Adicionar";

const form = document.createElement("form");
form.appendChild(descriptionInput);
form.appendChild(valueInput);
form.appendChild(typeSelect);
form.appendChild(categorySelect);
form.appendChild(submitButton);
const list = document.createElement("ul");
const balanceDisplay = document.createElement("p");
const incomeDisplay = document.createElement("p");
const expenseDisplay = document.createElement("p");
const themeButton = document.createElement("button");
themeButton.textContent = "🌙 Modo escuro";
themeButton.addEventListener("click", ()=> {
  document.body.classList.toggle("dark-mode");
});
incomeDisplay.className = "income";
expenseDisplay.className = "expense";

function renderList(): void {
  list.innerHTML = "";
  const transactions = store.getAll();
  transactions.forEach((transaction) => {
    const item = document.createElement("li");
    item.textContent = `${transaction.description} — R$ ${transaction.value} (${transaction.category})`;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", ()=> {
      store.removeTransaction(transaction.id);
      renderList();
      renderBalance();
    });
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => {
      descriptionInput.value = transaction.description;
      valueInput.value = String(transaction.value);
      typeSelect.value = transaction.type;
      categorySelect.value = transaction.category;
      editingId = transaction.id;
      submitButton.textContent = "Salvar";
    });
    item.appendChild(editButton);
    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

function renderBalance(): void{
  const balance = store.getBalance();
  balanceDisplay.textContent = `Saldo: R$ ${balance}`;
  const income = store.getTotalByType("income");
  incomeDisplay.textContent = `Entradas: R$ ${income}`;
  const expense = store.getTotalByType("expense");
  expenseDisplay.textContent = `Saídas: -R$ ${expense}`;

}
renderList();
renderBalance();



form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!descriptionInput.value.trim()) {
  alert("Digite uma descrição.");
  return;
}
const value = Number(valueInput.value);
if (!value || value <= 0) {
  alert("Digite um valor válido, maior que zero.");
  return;
}

  const description = descriptionInput.value;
  const type = typeSelect.value as TransactionType;
  const category = categorySelect.value as TransactionCategory;

  if (editingId) {
  store.updateTransaction(editingId, description, value, type, category);
  editingId = null;
  submitButton.textContent = "Adicionar";
} else {
  store.addTransaction(description, value, type, category, new Date());
}
  descriptionInput.value = "";
  valueInput.value = "";
  renderList();
  renderBalance();
});

const root = document.getElementById("app");
if(root) {
    root.appendChild(themeButton);
    root.appendChild(balanceDisplay);
    root.appendChild(incomeDisplay);
    root.appendChild(expenseDisplay);
    root.appendChild(form);
    root.appendChild(list);
}
}
