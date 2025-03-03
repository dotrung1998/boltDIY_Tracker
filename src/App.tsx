import React, { useState, useEffect } from "react";
import { Upload, Edit2, Trash2 } from "lucide-react";

const translations = {
  en: {
    sharedExpenseTracker: "Shared Expense Tracker",
    manageCategories: "Manage Categories",
    currentCategories: "Current Categories",
    addCategory: "Add Category",
    categoryName: "Category Name",
    enterCategoryName: "Enter category name",
    categoryIcon: "Category Icon",
    delete: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    enterCustomIcon: "Enter Custom Icon",
    addExpense: "Add Expense(s)",
    descriptionInputLabel: "Description (optional, separate multiple entries with ';' or '+')",
    amountInputLabel: "Amount (separate multiple entries with ';' or '+')",
    expenseDateLabel: "Expense Date (Month and Year)",
    currencyLabel: "Currency",
    categoryLabel: "Category",
    primaryCurrencyLabel: "Primary Currency",
    batchEditSelected: "Batch Edit Selected Expenses",
    applyChanges: "Apply Changes to Selected Expenses",
    noExpensesYet: "No expenses added yet. Start by adding your first expense!",
    totalExpenses: "Total Expenses:",
    downloadCSV: "Download CSV",
    importFile: "Import file",
    exampleItem: "e.g., Coffee",
    amountExample: "e.g., 10",
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  },
  es: {
    sharedExpenseTracker: "Rastreador de Gastos Compartidos",
    manageCategories: "Administrar Categorías",
    currentCategories: "Categorías Actuales",
    addCategory: "Agregar Categoría",
    categoryName: "Nombre de la Categoría",
    enterCategoryName: "Introduzca el nombre de la categoría",
    categoryIcon: "Icono de la Categoría",
    delete: "Eliminar",
    edit: "Editar",
    cancel: "Cancelar",
    save: "Guardar",
    enterCustomIcon: "Ingrese Ícono Personalizado",
    addExpense: "Agregar Gasto(s)",
    descriptionInputLabel: "Descripción (opcional, separar múltiples entradas con ';' o '+')",
    amountInputLabel: "Cantidad (separe varias entradas con ';' o '+')",
    expenseDateLabel: "Fecha del Gasto (Mes y Año)",
    currencyLabel: "Moneda",
    categoryLabel: "Categoría",
    primaryCurrencyLabel: "Moneda Principal",
    batchEditSelected: "Editar en Lote Gastos Seleccionados",
    applyChanges: "Aplicar Cambios a Gastos Seleccionados",
    noExpensesYet: "No hay gastos agregados. ¡Empieza añadiendo tu primer gasto!",
    totalExpenses: "Gastos Totales:",
    downloadCSV: "Descargar CSV",
    importFile: "Importar archivo",
    exampleItem: "ej., Paella",
    amountExample: "ej., 10",
    monthNames: [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ]
  },
  fr: {
    sharedExpenseTracker: "Suivi des Dépenses Partagées",
    manageCategories: "Gérer les Catégories",
    currentCategories: "Catégories Actuelles",
    addCategory: "Ajouter une Catégorie",
    categoryName: "Nom de la Catégorie",
    enterCategoryName: "Entrez le nom de la catégorie",
    categoryIcon: "Icône de la Catégorie",
    delete: "Supprimer",
    edit: "Modifier",
    cancel: "Annuler",
    save: "Enregistrer",
    enterCustomIcon: "Entrez une Icône Personnalisée",
    addExpense: "Ajouter une (des) Dépense(s)",
    descriptionInputLabel: "Description (facultatif, séparez plusieurs entrées avec ';' ou '+')",
    amountInputLabel: "Montant (séparez plusieurs entrées avec ';' ou '+')",
    expenseDateLabel: "Date de la Dépense (Mois et Année)",
    currencyLabel: "Devise",
    categoryLabel: "Catégorie",
    primaryCurrencyLabel: "Devise Principale",
    batchEditSelected: "Modifier en Lot les Dépenses Sélectionnées",
    applyChanges: "Appliquer les Modifications aux Dépenses Sélectionnées",
    noExpensesYet: "Aucune dépense ajoutée pour l'instant. Commencez par ajouter votre première dépense !",
    totalExpenses: "Dépenses Totales :",
    downloadCSV: "Télécharger CSV",
    importFile: "Importer un fichier",
    exampleItem: "ex., Baguette",
    amountExample: "ex., 10",
    monthNames: [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ]
  },
  de: {
    sharedExpenseTracker: "Gemeinsamer Ausgabenverfolger",
    manageCategories: "Kategorien verwalten",
    currentCategories: "Aktuelle Kategorien",
    addCategory: "Kategorie hinzufügen",
    categoryName: "Kategoriename",
    enterCategoryName: "Geben Sie den Kategorienamen ein",
    categoryIcon: "Kategorie-Symbol",
    delete: "Löschen",
    edit: "Bearbeiten",
    cancel: "Abbrechen",
    save: "Speichern",
    enterCustomIcon: "Benutzerdefiniertes Symbol eingeben",
    addExpense: "Ausgabe(n) hinzufügen",
    descriptionInputLabel: "Beschreibung (optional, trennen Sie mehrere Einträge mit ';' oder '+')",
    amountInputLabel: "Betrag (mehrere Einträge mit ';' oder '+' trennen)",
    expenseDateLabel: "Ausgabedatum (Monat und Jahr)",
    currencyLabel: "Währung",
    categoryLabel: "Kategorie",
    primaryCurrencyLabel: "Hauptwährung",
    batchEditSelected: "Ausgewählte Ausgaben in Batch bearbeiten",
    applyChanges: "Änderungen auf ausgewählte Ausgaben anwenden",
    noExpensesYet: "Noch keine Ausgaben hinzugefügt. Fügen Sie als erstes eine Ausgabe hinzu!",
    totalExpenses: "Gesamtausgaben:",
    downloadCSV: "CSV herunterladen",
    importFile: "Datei importieren",
    exampleItem: "z.B., Bratwurst",
    amountExample: "z.B., 10",
    monthNames: [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ]
  },
  it: {
    sharedExpenseTracker: "Tracciatore di spese condiviso",
    manageCategories: "Gestisci categorie",
    currentCategories: "Categorie correnti",
    addCategory: "Aggiungi categoria",
    categoryName: "Nome della categoria",
    enterCategoryName: "Inserisci il nome della categoria",
    categoryIcon: "Icona della categoria",
    delete: "Elimina",
    edit: "Modifica",
    cancel: "Annulla",
    save: "Salva",
    enterCustomIcon: "Inserisci icona personalizzata",
    addExpense: "Aggiungi spesa(e)",
    descriptionInputLabel: "Descrizione (opzionale, separa gli elementi con ';' o '+')",
    amountInputLabel: "Importo (separa più voci con ';' o '+')",
    expenseDateLabel: "Data della spesa (mese e anno)",
    currencyLabel: "Valuta",
    categoryLabel: "Categoria",
    primaryCurrencyLabel: "Valuta principale",
    batchEditSelected: "Modifica in batch delle spese selezionate",
    applyChanges: "Applica modifiche alle spese selezionate",
    noExpensesYet: "Nessuna spesa aggiunta finora. Inizia aggiungendo la tua prima spesa!",
    totalExpenses: "Totale spese:",
    downloadCSV: "Scarica CSV",
    importFile: "Importa file",
    exampleItem: "es., Pizza",
    amountExample: "es., 10",
    monthNames: [
      "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
      "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"
    ]
  },
  vi: {
    sharedExpenseTracker: "Trình Theo Dõi Chi Phí Chung",
    manageCategories: "Quản Lý Danh Mục",
    currentCategories: "Danh Mục Hiện Tại",
    addCategory: "Thêm Danh Mục",
    categoryName: "Tên Danh Mục",
    enterCategoryName: "Nhập tên danh mục",
    categoryIcon: "Biểu Tượng Danh Mục",
    delete: "Xóa",
    edit: "Chỉnh Sửa",
    cancel: "Hủy",
    save: "Lưu",
    enterCustomIcon: "Nhập Biểu Tượng Tùy Chỉnh",
    addExpense: "Thêm Chi Phí",
    descriptionInputLabel: "Mô Tả (tùy chọn, phân tách các mục bằng ';' hoặc '+')",
    amountInputLabel: "Số Tiền (nếu có nhiều mục, phân tách bằng ';' hoặc '+')",
    expenseDateLabel: "Ngày Chi Phí (Tháng và Năm)",
    currencyLabel: "Tiền Tệ",
    categoryLabel: "Danh Mục",
    primaryCurrencyLabel: "Tiền Tệ Chính",
    batchEditSelected: "Chỉnh Sửa Hàng Loạt Các Chi Phí Đã Chọn",
    applyChanges: "Áp Dụng Thay Đổi Cho Các Chi Phí Đã Chọn",
    noExpensesYet: "Chưa có chi phí nào được thêm. Hãy bắt đầu bằng cách thêm chi phí đầu tiên của bạn!",
    totalExpenses: "Tổng Chi Phí:",
    downloadCSV: "Tải CSV",
    importFile: "Nhập tệp",
    exampleItem: "vd: Phở",
    amountExample: "vd: 10k",
    monthNames: [
      "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
      "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
    ]
  }
};

// Helper to safely return translated category names, fallback to default if not defined.
const getTranslatedCategory = (key, defaultName, t) => {
  return t.categories && t.categories[key] ? t.categories[key] : defaultName;
};

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const currentDate = new Date();
  const [expenseYear, setExpenseYear] = useState(currentDate.getFullYear().toString());
  const [expenseMonth, setExpenseMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, "0"));
  const [currency, setCurrency] = useState("EUR");
  const [category, setCategory] = useState("eating");
  const [categories, setCategories] = useState({
    eating: { name: "Eating in the restaurant", icon: "🍽️" },
    groceries: { name: "Groceries", icon: "🛒" },
    furniture: { name: "Furniture", icon: "🪑" },
    other: { name: "Other", icon: "📦" }
  });
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [showCustomIconModal, setShowCustomIconModal] = useState(false);
  const [customIcon, setCustomIcon] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryCustomIcon, setEditingCategoryCustomIcon] = useState("");
  const [showEditCategoryCustomIconModal, setShowEditCategoryCustomIconModal] = useState(false);
  const [primaryCurrency, setPrimaryCurrency] = useState("EUR");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);
  const [batchEditDescription, setBatchEditDescription] = useState("");
  const [batchEditCategory, setBatchEditCategory] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buttonColor, setButtonColor] = useState("#F1C4D9");
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const amountExample = currency === "VND" ? (language === "vi" ? "vd: 10k" : "10k") : t.amountExample;

  const currencies = {
    EUR: { symbol: "€", rate: 25000 },
    USD: { symbol: "$", rate: 23000 },
    VND: { symbol: "₫", rate: 1 }
  };

  const convertAmountTo = (amountValue, fromCurrency, toCurrency) => {
    return amountValue * (currencies[fromCurrency].rate / currencies[toCurrency].rate);
  };

  const formatCurrency = (value, curr) => {
    if (curr === "VND") {
      return `₫${Math.round(value).toLocaleString("vi-VN")}`;
    }
    return `${currencies[curr].symbol}${value.toFixed(2)} ${curr}`;
  };

  const formatCurrencyForCSV = (value, curr) => {
    if (curr === "VND") {
      return `${Math.round(value).toString()}`;
    }
    return `${value.toFixed(2)}`;
  };

  const convertDateToFileString = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = t.monthNames || [];
    return monthNames[parseInt(month, 10) - 1] + " " + year;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    const expenseDate = `${expenseYear}-${expenseMonth}`;
    const rawAmountParts = amount.split(/[;+]/).map(s => s.trim()).filter(s => s !== "");
    let descriptionParts = description.split(/[;+]/).map(s => s.trim()).filter(s => s !== "");
    if (descriptionParts.length === 0) {
      descriptionParts = Array(rawAmountParts.length).fill("");
    }
    if (descriptionParts.length === 1 && rawAmountParts.length > 1) {
      descriptionParts = Array(rawAmountParts.length).fill(descriptionParts[0]);
    }
    if (descriptionParts.length !== rawAmountParts.length) {
      alert("The number of descriptions (if provided) and amounts must match.");
      return;
    }
    const newExpenses = descriptionParts.map((desc, index) => {
      const cleanAmountStr = rawAmountParts[index].replace(",", ".");
      return {
        id: Date.now() + index,
        description: desc,
        amount: parseFloat(cleanAmountStr),
        currency,
        category,
        date: expenseDate
      };
    });
    setExpenses([...expenses, ...newExpenses]);
    setAmount("");
    setDescription("");
  };

  const deleteCategory = (categoryKey) => {
    setExpenses(prev => prev.filter(exp => exp.category !== categoryKey));
    setCategories(prev => {
      const updated = { ...prev };
      delete updated[categoryKey];
      return updated;
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    setSelectedExpenseIds(ids => ids.filter(expId => expId !== id));
    if (editingExpenseId === id) {
      setEditingExpenseId(null);
    }
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setEditingExpenseId(null);
  };

  const applyAllBatchEdits = () => {
    let updatedExpenses = [...expenses];
    if (batchEditDescription.trim() !== "") {
      updatedExpenses = updatedExpenses.map(exp =>
        selectedExpenseIds.includes(exp.id) ? { ...exp, description: batchEditDescription } : exp
      );
    }
    if (batchEditCategory) {
      updatedExpenses = updatedExpenses.map(exp =>
        selectedExpenseIds.includes(exp.id) ? { ...exp, category: batchEditCategory } : exp
      );
    }
    setExpenses(updatedExpenses);
    setBatchEditDescription("");
    setBatchEditCategory("");
    setSelectedExpenseIds([]);
  };

  const calculateGrandTotal = () => {
    return expenses.reduce(
      (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
      0
    );
  };

  const toggleSelectExpense = (id) => {
    setSelectedExpenseIds(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(expId => expId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const toggleSelectAllInCategory = (categoryKey) => {
    const categoryExpenseIds = expenses
      .filter(exp => exp.category === categoryKey)
      .map(exp => exp.id);
    const allSelected = categoryExpenseIds.every(id => selectedExpenseIds.includes(id));
    if (allSelected) {
      setSelectedExpenseIds(prevSelected => prevSelected.filter(id => !categoryExpenseIds.includes(id)));
    } else {
      setSelectedExpenseIds(prevSelected => {
        const newSelected = [...prevSelected];
        categoryExpenseIds.forEach(id => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    }
  };

  const escapeCSV = (field) => {
    const stringField = field.toString();
    if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
      return '"' + stringField.replace(/"/g, '""') + '"';
    }
    return stringField;
  };

  const downloadCSV = () => {
    const csvRows = [];
    let rowIndex = 1;
    csvRows.push(["ID", "Description", "Date", "Amount", "Currency", "Original Amount", "Category"].map(escapeCSV).join(","));
    rowIndex++;
    const categoryTotalCellRefs = [];
    Object.keys(categories).forEach(categoryKey => {
      const categoryExpenses = expenses.filter(exp => exp.category === categoryKey);
      if (categoryExpenses.length === 0) return;
      csvRows.push(["", "", "", "", "", "", ""].join(","));
      rowIndex++;
      csvRows.push([`CATEGORY: ${getTranslatedCategory(categoryKey, categories[categoryKey].name, t)}`, "", "", "", "", "", ""].map(escapeCSV).join(","));
      rowIndex++;
      csvRows.push(["", "", "", "", "", "", ""].join(","));
      rowIndex++;
      const expenseStart = rowIndex;
      categoryExpenses.forEach((exp, index) => {
        const convertedAmount = convertAmountTo(exp.amount, exp.currency, primaryCurrency);
        csvRows.push([
          index + 1,
          exp.description || "No description",
          exp.date || "",
          formatCurrencyForCSV(convertedAmount, primaryCurrency),
          primaryCurrency,
          formatCurrencyForCSV(exp.amount, exp.currency) + " " + exp.currency,
          getTranslatedCategory(exp.category, categories[exp.category]?.name || exp.category, t)
        ].map(escapeCSV).join(","));
        rowIndex++;
      });
      const expenseEnd = rowIndex - 1;
      csvRows.push(["", "", "", "", "", "", ""].join(","));
      rowIndex++;
      const categoryTotalFormula = `=SUM(D${expenseStart}:D${expenseEnd})`;
      csvRows.push(["", "CATEGORY TOTAL:", "", categoryTotalFormula, primaryCurrency, "", ""].map(escapeCSV).join(","));
      categoryTotalCellRefs.push(`D${rowIndex}`);
      rowIndex++;
      csvRows.push(["", "", "", "", "", "", ""].join(","));
      rowIndex++;
    });
    csvRows.push(["", "", "", "", "", "", ""].join(","));
    rowIndex++;
    const grandTotalFormula = `=SUM(${categoryTotalCellRefs.join(",")})`;
    csvRows.push(["", "GRAND TOTAL:", "", grandTotalFormula, primaryCurrency, "", ""].map(escapeCSV).join(","));
    const fileDate = expenseYear && expenseMonth ? convertDateToFileString(`${expenseYear}-${expenseMonth}`) : convertDateToFileString(new Date().toISOString().slice(0, 7));
    const fileName = `Expense_Tracker_${fileDate}.csv`;
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text) => {
    const rows = text.split("\n").filter(row => row.trim() !== "");
    return rows.map(row =>
      row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => {
        let c = cell.trim();
        if (c.startsWith('"') && c.endsWith('"')) {
          c = c.slice(1, -1).replace(/""/g, '"');
        }
        return c;
      })
    );
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const data = parseCSV(content);
      const newExpenses = [];
      const newCategories = { ...categories };
      let currentCategoryName = "";
      let uniqueIdCounter = Date.now();
      let startRow = 0;
      if (data[0] && data[0][0] === "ID") {
        startRow = 1;
      }
      for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        if (row.every(cell => cell.trim() === "")) continue;
        if (row[0].startsWith("CATEGORY:")) {
          currentCategoryName = row[0].split("CATEGORY:")[1].trim();
          const catKey = currentCategoryName.toLowerCase().replace(/\s+/g, "_");
          if (!newCategories[catKey]) {
            newCategories[catKey] = { name: currentCategoryName, icon: "🔖" };
          }
          continue;
        }
        if (row[1] && (row[1].includes("CATEGORY TOTAL:") || row[1].includes("GRAND TOTAL:"))) continue;
        if (row.length !== 7) continue;
        const expenseCategoryName = row[6] ? row[6].trim() : currentCategoryName;
        const catKey = expenseCategoryName.toLowerCase().replace(/\s+/g, "_");
        if (!newCategories[catKey]) {
          newCategories[catKey] = { name: expenseCategoryName, icon: "🔖" };
        }
        newExpenses.push({
          id: uniqueIdCounter++,
          description: row[1],
          date: row[2],
          amount: parseFloat(row[3]),
          currency: row[4],
          category: catKey
        });
      }
      setExpenses(newExpenses);
      setCategories(newCategories);
    };
    reader.readAsText(file);
  };

  const InlineEditExpense = ({ expense, onSave, onCancel }) => {
    const [editData, setEditData] = useState({
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      date: expense.date || ""
    });
    return (
      <div className="p-4 bg-gray-100 rounded-lg mb-2">
        <div className="grid grid-cols-5 gap-3">
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-2 rounded border"
            placeholder="Description"
          />
          <input
            type="text"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            className="w-full p-2 rounded border"
            placeholder="Amount"
          />
          <select
            value={editData.currency}
            onChange={(e) => setEditData({ ...editData, currency: e.target.value })}
            className="w-full p-2 rounded border"
          >
            {Object.entries(currencies).map(([code, { symbol }]) => (
              <option key={code} value={code}>
                {code} ({symbol})
              </option>
            ))}
          </select>
          <select
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="w-full p-2 rounded border"
          >
            {Object.entries(categories).map(([key, { icon, name }]) => (
              <option key={key} value={key}>
                {icon} {getTranslatedCategory(key, name, t)}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className="w-full p-2 rounded border"
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded text-red-500 hover:bg-red-50">
            {t.cancel}
          </button>
          <button
            onClick={() =>
              onSave({
                ...expense,
                ...editData,
                amount: parseFloat(editData.amount)
              })
            }
            style={{ backgroundColor: buttonColor }}
            className="px-3 py-1 text-white rounded hover:opacity-90"
          >
            {t.save}
          </button>
        </div>
      </div>
    );
  };

  const CategorySection = ({ categoryKey }) => {
    const categoryExpenses = expenses.filter(exp => exp.category === categoryKey);
    if (categoryExpenses.length === 0) return null;
    const allSelected = categoryExpenses.every(exp => selectedExpenseIds.includes(exp.id));
    const total = categoryExpenses.reduce(
      (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
      0
    );
    return (
      <div className="mb-8 relative">
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => toggleSelectAllInCategory(categoryKey)}
              className="h-5 w-5"
            />
            <span>
              {categories[categoryKey].icon} {getTranslatedCategory(categoryKey, categories[categoryKey].name, t)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingCategory({ key: categoryKey, name: categories[categoryKey].name, icon: categories[categoryKey].icon })}
              className="group relative"
            >
              <Edit2 className="h-5 w-5 text-blue-500" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 z-50">
                {t.edit}
              </span>
            </button>
            <button onClick={() => deleteCategory(categoryKey)} className="group relative">
              <Trash2 className="h-5 w-5 text-red-500" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-red-500 opacity-0 group-hover:opacity-100 z-50">
                {t.delete}
              </span>
            </button>
          </div>
        </h2>
        <div className="space-y-2">
          {categoryExpenses.map(expense => {
            if (editingExpenseId === expense.id) {
              return (
                <InlineEditExpense
                  key={expense.id}
                  expense={expense}
                  onSave={updateExpense}
                  onCancel={() => setEditingExpenseId(null)}
                />
              );
            }
            return (
              <div key={expense.id} className={`flex items-center justify-between p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg mb-2 relative`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedExpenseIds.includes(expense.id)}
                    onChange={() => toggleSelectExpense(expense.id)}
                    className="h-5 w-5"
                  />
                  <span className="text-lg mr-8">
                    {expense.description || <em className="text-gray-400">No description</em>}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(expense.amount, expense.currency)}
                  </div>
                  <div className="text-gray-500">
                    ({formatCurrency(convertAmountTo(expense.amount, expense.currency, primaryCurrency), primaryCurrency)})
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingExpenseId(expense.id)} className="group relative">
                    <Edit2 className="h-5 w-5 text-blue-500" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 z-50">
                      {t.edit}
                    </span>
                  </button>
                  <button onClick={() => deleteExpense(expense.id)} className="group relative">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-red-500 opacity-0 group-hover:opacity-100 z-50">
                      {t.delete}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
          <div className="mt-4 text-right">
            <div className="font-bold text-lg">Category Total:</div>
            <div className="text-xl font-bold">
              {formatCurrency(total, primaryCurrency)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleCategoryIconChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomIconModal(true);
      setNewCategory({ ...newCategory, icon: "" });
    } else {
      setNewCategory({ ...newCategory, icon: value });
    }
  };

  const handleCustomIconOk = () => {
    if (customIcon.trim()) {
      setNewCategory({ ...newCategory, icon: customIcon });
    }
    setCustomIcon("");
    setShowCustomIconModal(false);
  };

  const handleCustomIconCancel = () => {
    setCustomIcon("");
    setShowCustomIconModal(false);
  };

  const handleEditCategoryIconChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowEditCategoryCustomIconModal(true);
      setEditingCategoryCustomIcon("");
    } else {
      setEditingCategory({ ...editingCategory, icon: value });
    }
  };

  const handleEditCategoryCustomIconOk = () => {
    if (editingCategoryCustomIcon.trim()) {
      setEditingCategory({ ...editingCategory, icon: editingCategoryCustomIcon });
    }
    setEditingCategoryCustomIcon("");
    setShowEditCategoryCustomIconModal(false);
  };

  const handleEditCategoryCustomIconCancel = () => {
    setEditingCategoryCustomIcon("");
    setShowEditCategoryCustomIconModal(false);
  };

  const saveEditedCategory = () => {
    const { key, name, icon } = editingCategory;
    setCategories(prev => ({
      ...prev,
      [key]: { name, icon }
    }));
    setEditingCategory(null);
  };

  const inputSelectClass = `w-full p-3 rounded-xl border ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900"}`;

  const currentYear = currentDate.getFullYear();
  const years = [];
  for (let y = currentYear - 100; y <= currentYear + 100; y++) {
    years.push(y.toString());
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen p-6 transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="darkModeToggle" className="text-sm font-medium">{isDarkMode ? "Dark Mode" : "Light Mode"}</label>
          <input
            id="darkModeToggle"
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            className="h-5 w-5"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" htmlFor="buttonColorPicker">Button Color:</label>
          <input
            id="buttonColorPicker"
            type="color"
            value={buttonColor}
            onChange={(e) => setButtonColor(e.target.value)}
            className="w-8 h-8 rounded border p-0 cursor-pointer"
          />
        </div>
        <div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputSelectClass}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-6 transition-colors`}>
          <h1 className="text-2xl font-bold mb-6 text-center">{t.sharedExpenseTracker}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.descriptionInputLabel}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputSelectClass}
                  placeholder={t.exampleItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.amountInputLabel}</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={inputSelectClass}
                  placeholder={amountExample}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t.expenseDateLabel}</label>
              <div className="flex gap-4">
                <select
                  value={expenseMonth}
                  onChange={(e) => setExpenseMonth(e.target.value.padStart(2, "0"))}
                  className={inputSelectClass}
                >
                  {t.monthNames.map((month, index) => (
                    <option key={index} value={(index + 1).toString().padStart(2, "0")}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={expenseYear}
                  onChange={(e) => setExpenseYear(e.target.value)}
                  className={inputSelectClass}
                >
                  {years.map((yr, index) => (
                    <option key={index} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.currencyLabel}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputSelectClass}
                >
                  {Object.entries(currencies).map(([code, { symbol }]) => (
                    <option key={code} value={code}>
                      {code} ({symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.categoryLabel}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputSelectClass}
                >
                  {Object.entries(categories).map(([key, { icon, name }]) => (
                    <option key={key} value={key}>
                      {icon} {getTranslatedCategory(key, name, t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.primaryCurrencyLabel}</label>
                <select
                  value={primaryCurrency}
                  onChange={(e) => setPrimaryCurrency(e.target.value)}
                  className={inputSelectClass}
                >
                  {Object.entries(currencies).map(([code, { symbol }]) => (
                    <option key={code} value={code}>
                      {code} ({symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{ backgroundColor: buttonColor }}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
            >
              {t.addExpense}
            </button>
          </form>
        </div>

        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-6 transition-colors`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t.manageCategories}</h2>
            <div className="group relative">
              <input id="file-upload" type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-gray-500 dark:text-gray-200 opacity-0 group-hover:opacity-100 z-50">
                  {t.importFile}
                </span>
              </label>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCategory.name) return;
              const id = newCategory.name.toLowerCase().replace(/\s+/g, "_");
              setCategories({
                ...categories,
                [id]: { name: newCategory.name, icon: newCategory.icon || "🔖" }
              });
              setNewCategory({ name: "", icon: "" });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.categoryName}</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className={inputSelectClass}
                  placeholder={t.enterCategoryName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.categoryIcon}</label>
                <select
                  value={newCategory.icon}
                  onChange={handleCategoryIconChange}
                  className={inputSelectClass}
                >
                  {["🍽️", "🛒", "🪑", "📦", "💻", "🏠", "🚗", "🍎", "🍹"].map((emoji, idx) => (
                    <option key={idx} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{ backgroundColor: buttonColor }}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
            >
              {t.addCategory}
            </button>
          </form>
          {showCustomIconModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg max-w-sm w-full transition-colors`}>
                <h3 className="text-lg font-bold mb-4">{t.enterCustomIcon}</h3>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className={inputSelectClass + " mb-4"}
                  placeholder="Type your icon here"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCustomIconCancel}
                    className="px-4 py-2 text-red-500 border border-red-500 rounded-lg font-medium"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleCustomIconOk}
                    style={{ backgroundColor: buttonColor }}
                    className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">{t.currentCategories}</h3>
            <ul>
              {Object.entries(categories).map(([key, { icon, name }]) => (
                <li key={key} className="flex justify-between items-center border p-2 rounded-lg mb-2">
                  <span>
                    {icon} {getTranslatedCategory(key, name, t)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory({ key, name, icon })}
                      className="group relative"
                    >
                      <Edit2 className="h-5 w-5 text-blue-500" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 z-50">
                        {t.edit}
                      </span>
                    </button>
                    <button onClick={() => deleteCategory(key)} className="group relative">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-red-500 opacity-0 group-hover:opacity-100 z-50">
                        {t.delete}
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-lg max-w-sm w-full transition-colors`}>
              <h3 className="text-lg font-bold mb-4">{t.edit} {t.categoryName}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.categoryName}</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className={inputSelectClass}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t.categoryIcon}</label>
                <select
                  value={editingCategory.icon}
                  onChange={handleEditCategoryIconChange}
                  className={inputSelectClass}
                >
                  {["🍽️", "🛒", "🪑", "📦", "💻", "🏠", "🚗", "🍎", "🍹"].map((emoji, idx) => (
                    <option key={idx} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>
              </div>
              {showEditCategoryCustomIconModal && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={editingCategoryCustomIcon}
                    onChange={(e) => setEditingCategoryCustomIcon(e.target.value)}
                    className={inputSelectClass}
                    placeholder="Type your icon here"
                  />
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      onClick={handleEditCategoryCustomIconCancel}
                      className="px-4 py-2 text-red-500 border border-red-500 rounded-lg font-medium"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={handleEditCategoryCustomIconOk}
                      style={{ backgroundColor: buttonColor }}
                      className="px-4 py-2 text-white rounded-lg font-medium hover:opacity-90"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border rounded text-red-500 hover:bg-red-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={saveEditedCategory}
                  style={{ backgroundColor: buttonColor }}
                  className="px-4 py-2 text-white rounded hover:opacity-90"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedExpenseIds.length > 0 && (
          <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-6 transition-colors`}>
            <h2 className="text-xl font-bold mb-4">
              {t.batchEditSelected} ({selectedExpenseIds.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Description</label>
                <input
                  type="text"
                  value={batchEditDescription}
                  onChange={(e) => setBatchEditDescription(e.target.value)}
                  className={inputSelectClass}
                  placeholder="Enter new description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Update Category</label>
                <select
                  value={batchEditCategory}
                  onChange={(e) => setBatchEditCategory(e.target.value)}
                  className={inputSelectClass}
                >
                  <option value="">-- Select new category --</option>
                  {Object.entries(categories).map(([key, { icon, name }]) => (
                    <option key={key} value={key}>
                      {icon} {getTranslatedCategory(key, name, t)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={applyAllBatchEdits}
              style={{ backgroundColor: buttonColor }}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
              disabled={!batchEditDescription && !batchEditCategory}
            >
              {t.applyChanges}
            </button>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mb-6">
            <button
              onClick={downloadCSV}
              style={{ backgroundColor: buttonColor }}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
            >
              {t.downloadCSV}
            </button>
          </div>
        )}

        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 transition-colors`}>
          {Object.keys(categories).map(categoryKey => (
            <CategorySection key={categoryKey} categoryKey={categoryKey} />
          ))}
          {expenses.length > 0 && (
            <div className="mt-8 pt-8 border-t-2">
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-2">{t.totalExpenses}</h2>
                <div className="text-2xl font-bold">{formatCurrency(calculateGrandTotal(), primaryCurrency)}</div>
              </div>
            </div>
          )}
          {expenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t.noExpensesYet}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
