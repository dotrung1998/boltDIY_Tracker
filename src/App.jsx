import React, { useState } from "react";

    const ExpenseTracker = () => {
      // Expense input states
      const [expenses, setExpenses] = useState([]);
      const [amount, setAmount] = useState("");
      const [description, setDescription] = useState("");
      const [currency, setCurrency] = useState("EUR");
      const [category, setCategory] = useState("eating");
      // New state for expense date (type month, e.g., "2025-01")
      const [expenseDate, setExpenseDate] = useState("");

      // Predefined categories with emojis (for preview only)
      const [categories, setCategories] = useState({
        eating: { name: "Eating in the restaurant", icon: "🍽️" },
        groceries: { name: "Groceries", icon: "🛒" },
        furniture: { name: "Furniture", icon: "🪑" },
        other: { name: "Other", icon: "📦" }
      });

      // State for adding new category and custom icon modal
      const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
      const [showCustomIconModal, setShowCustomIconModal] = useState(false);
      const [customIcon, setCustomIcon] = useState("");

      // State for editing an existing category
      // editingCategory: { key, name, icon }
      const [editingCategory, setEditingCategory] = useState(null);
      const [editingCategoryCustomIcon, setEditingCategoryCustomIcon] = useState("");
      const [showEditCategoryCustomIconModal, setShowEditCategoryCustomIconModal] = useState(false);

      // State for selecting primary currency for totals
      const [primaryCurrency, setPrimaryCurrency] = useState("EUR");

      // State for inline editing a single expense (stores id of expense being edited)
      const [editingExpenseId, setEditingExpenseId] = useState(null);
      
      // State for batch editing: selected expenses IDs and the batch editing values
      const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);
      const [batchEditDescription, setBatchEditDescription] = useState("");
      const [batchEditCategory, setBatchEditCategory] = useState("");

      // Defined currencies with exchange rates
      const currencies = {
        EUR: { symbol: "€", rate: 25000 },
        USD: { symbol: "$", rate: 23000 },
        VND: { symbol: "₫", rate: 1 }
      };

      // Conversion: Convert any price from its source currency to the target currency.
      const convertAmountTo = (amountValue, fromCurrency, toCurrency) => {
        return amountValue * (currencies[fromCurrency].rate / currencies[toCurrency].rate);
      };

      // Formatting amounts in desired currency (for preview)
      const formatCurrency = (value, curr) => {
        if (curr === "VND") {
          return `₫${Math.round(value).toLocaleString("vi-VN")}`;
        }
        return `${currencies[curr].symbol}${value.toFixed(2)} ${curr}`;
      };

      // Formatting for CSV (without currency symbol)
      const formatCurrencyForCSV = (value, curr) => {
        if (curr === "VND") {
          return `${Math.round(value).toString()}`;
        }
        return `${value.toFixed(2)}`;
      };

      // Handle adding new expenses.
      // Allows multiple entries separated by ";" or "+", and uses the provided date for all.
      const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return;

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

      // Delete a category along with its expenses.
      const deleteCategory = (categoryKey) => {
        setExpenses(prev => prev.filter(exp => exp.category !== categoryKey));
        setCategories(prev => {
          const updated = { ...prev };
          delete updated[categoryKey];
          return updated;
        });
      };

      // Delete a specific expense.
      const deleteExpense = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
        setSelectedExpenseIds(ids => ids.filter(expId => expId !== id));
        if (editingExpenseId === id) {
          setEditingExpenseId(null);
        }
      };

      // Update an expense with new data.
      const updateExpense = (updatedExpense) => {
        setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
        setEditingExpenseId(null);
      };

      // Batch update description for selected expenses.
      const applyBatchEditDescription = () => {
        if (batchEditDescription.trim() === "") return;
        const updatedExpenses = expenses.map(exp => 
          selectedExpenseIds.includes(exp.id) ? { ...exp, description: batchEditDescription } : exp
        );
        setExpenses(updatedExpenses);
        setBatchEditDescription("");
      };

      // Batch update category for selected expenses.
      const applyBatchEditCategory = () => {
        if (!batchEditCategory) return;
        const updatedExpenses = expenses.map(exp => 
          selectedExpenseIds.includes(exp.id) ? { ...exp, category: batchEditCategory } : exp
        );
        setExpenses(updatedExpenses);
        setBatchEditCategory("");
      };

      // Apply all batch edits and reset selection.
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

      // Calculate grand total in primary currency (for UI).
      const calculateGrandTotal = () => {
        return expenses.reduce(
          (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
          0
        );
      };

      // Calculate category total in primary currency (for UI).
      const calculateCategoryTotal = (categoryKey) => {
        return expenses
          .filter(exp => exp.category === categoryKey)
          .reduce(
            (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
            0
          );
      };

      // Toggle selection for batch edit.
      const toggleSelectExpense = (id) => {
        setSelectedExpenseIds(prevSelected => {
          if (prevSelected.includes(id)) {
            return prevSelected.filter(expId => expId !== id);
          } else {
            return [...prevSelected, id];
          }
        });
      };

      // Select/deselect all expenses in a category.
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

      // Escape CSV field (add quotes if needed).
      const escapeCSV = (field) => {
        const stringField = field.toString();
        if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
          return '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
      };

      // Helper to convert expenseDate ("YYYY-MM") to a file-friendly string (e.g., "January 2025").
      const convertDateToFileString = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[parseInt(month, 10) - 1] + " " + year;
      };

      // Download CSV summary of expenses organized by categories with totals using =SUM formulas.
      const downloadCSV = () => {
        const csvRows = [];
        let rowIndex = 1;
        // Header row
        csvRows.push(["ID", "Description", "Date", "Amount", "Currency", "Original Amount", "Category"].map(escapeCSV).join(","));
        rowIndex++;
        const categoryTotalCellRefs = [];

        Object.keys(categories).forEach(categoryKey => {
          const categoryExpenses = expenses.filter(exp => exp.category === categoryKey);
          if (categoryExpenses.length === 0) return;
          
          csvRows.push(["", "", "", "", "", "", ""].join(","));
          rowIndex++;
          csvRows.push([`CATEGORY: ${categories[categoryKey].name}`, "", "", "", "", "", ""].map(escapeCSV).join(","));
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
              categories[exp.category]?.name || exp.category
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
        
        const fileDate = expenseDate ? convertDateToFileString(expenseDate) : convertDateToFileString(new Date().toISOString().slice(0, 7));
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

      // CSV Parsing function to handle simple CSV parsing.
      const parseCSV = (text) => {
        const rows = text.split("\n").filter(row => row.trim() !== "");
        const data = rows.map(row =>
          row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => {
            let c = cell.trim();
            if (c.startsWith('"') && c.endsWith('"')) {
              c = c.slice(1, -1).replace(/""/g, '"');
            }
            return c;
          })
        );
        return data;
      };

      // Handle CSV file upload and update the app state.
      // When an uploaded category name matches an existing category, reuse its emoji.
      const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const data = parseCSV(content);
          // New states to hold parsed expenses and categories.
          const newExpenses = [];
          const newCategories = { ...categories }; // start with current categories
          let currentCategoryName = "";
          let uniqueIdCounter = Date.now();
          
          // Expected header for expense rows.
          // Header row: ["ID", "Description", "Date", "Amount", "Currency", "Original Amount", "Category"]
          let startRow = 0;
          if (data[0][0] === "ID") {
            startRow = 1;
          }
          
          for (let i = startRow; i < data.length; i++) {
            const row = data[i];
            if (row.every(cell => cell.trim() === "")) continue;
            // Category header row processing.
            if (row[0].startsWith("CATEGORY:")) {
              currentCategoryName = row[0].split("CATEGORY:")[1].trim();
              const catKey = currentCategoryName.toLowerCase().replace(/\s+/g, "_");
              // If current category exists, keep its emoji; otherwise use default.
              if (!newCategories[catKey]) {
                newCategories[catKey] = { name: currentCategoryName, icon: "🔖" };
              }
              continue;
            }
            // Skip rows for category total or grand total.
            if (row[1] && (row[1].includes("CATEGORY TOTAL:") || row[1].includes("GRAND TOTAL:"))) continue;
            if (row.length !== 7) continue;
            // Use the category from the row if available, else fall back to current category.
            const expenseCategoryName = row[6] ? row[6].trim() : currentCategoryName;
            const catKey = expenseCategoryName.toLowerCase().replace(/\s+/g, "_");
            // If not already in categories, add it.
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

      // Inline editing component for a single expense.
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
              <div>
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full p-2 rounded border"
                  placeholder="Description"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full p-2 rounded border"
                  placeholder="Amount"
                />
              </div>
              <div>
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
              </div>
              <div>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full p-2 rounded border"
                >
                  {Object.entries(categories).map(([key, { name, icon }]) => (
                    <option key={key} value={key}>
                      {icon} {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="month"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={onCancel} className="px-3 py-1 border rounded text-red-500 hover:bg-red-50">
                Cancel
              </button>
              <button
                onClick={() =>
                  onSave({
                    ...expense,
                    ...editData,
                    amount: parseFloat(editData.amount)
                  })
                }
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        );
      };

      // Component for displaying a single category and its expenses.
      const CategorySection = ({ categoryKey }) => {
        const categoryExpenses = expenses.filter(exp => exp.category === categoryKey);
        if (categoryExpenses.length === 0) return null;
        const total = categoryExpenses.reduce(
          (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
          0
        );
        const allSelected = categoryExpenses.length > 0 &&
          categoryExpenses.every(exp => selectedExpenseIds.includes(exp.id));
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
                <span>{categories[categoryKey].icon} {categories[categoryKey].name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingCategory({ key: categoryKey, ...categories[categoryKey] })}
                  className="text-blue-500 text-lg hover:underline">
                  Edit
                </button>
                <button onClick={() => deleteCategory(categoryKey)} className="text-red-500 text-lg hover:underline">
                  x
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
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2 relative">
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
                    <div className="flex gap-2 absolute bottom-2 left-10">
                      <button
                        onClick={() => setEditingExpenseId(expense.id)}
                        className="px-2 py-1 text-blue-500 text-sm border rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="px-2 py-1 text-red-500 text-sm border rounded hover:bg-red-50"
                      >
                        x
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

      // Handler for Category Icon change in new category form.
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

      // Handlers for editing current category.
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
        // Update categories state.
        setCategories(prev => ({
          ...prev,
          [key]: { name, icon }
        }));
        // Optionally update expenses that reference this category.
        setExpenses(prev =>
          prev.map(exp => exp.category === key ? { ...exp, category: key } : exp)
        );
        setEditingCategory(null);
      };

      return (
        <div className="min-h-screen p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {/* Expense Input Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold mb-6 text-center">Shared Expense Tracker</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description (optional, separate multiple entries with ";" or "+")
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                      placeholder="e.g., rossmann"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount (separate multiple entries with ";" or "+")
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                      placeholder='e.g., 10,98;15.79 or 10,98+15.79'
                      required
                    />
                  </div>
                </div>
                {/* New Expense Date Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Expense Date (Month and Year)</label>
                  <input
                    type="month"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-3 rounded-xl border"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                    >
                      {Object.entries(currencies).map(([code, { symbol }]) => (
                        <option key={code} value={code}>
                          {code} ({symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                    >
                      {Object.entries(categories).map(([key, { name, icon }]) => (
                        <option key={key} value={key}>
                          {icon} {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Currency</label>
                    <select
                      value={primaryCurrency}
                      onChange={(e) => setPrimaryCurrency(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                    >                      {Object.entries(currencies).map(([code, { symbol }]) => (
                        <option key={code} value={code}>
                          {code} ({symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F1C4D9" }}
                >
                  Add Expense(s)
                </button>
              </form>
            </div>

            {/* CSV Upload and Manage Categories Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                <div>
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="border p-2 rounded" />
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
                    <label className="block text-sm font-medium mb-2">Category Name</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border"
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category Icon</label>
                    <select
                      value={newCategory.icon}
                      onChange={handleCategoryIconChange}
                      className="w-full p-3 rounded-xl border"
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
                  className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#E9D7F7" }}
                >
                  Add Category
                </button>
              </form>
              {showCustomIconModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                  <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                    <h3 className="text-lg font-bold mb-4">Enter Custom Icon</h3>
                    <input
                      type="text"
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      className="w-full p-3 rounded-xl border mb-4"
                      placeholder="Type your icon here"
                    />
                    <div className="flex justify-end space-x-3">
                      <button onClick={handleCustomIconCancel} className="px-4 py-2 text-red-500 border border-red-500 rounded-lg font-medium">
                        Cancel
                      </button>
                      <button onClick={handleCustomIconOk} className="px-4 py-2 text-white bg-green-500 rounded-lg font-medium">
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Current Categories</h3>
                <ul>
                  {Object.entries(categories).map(([key, { name, icon }]) => (
                    <li key={key} className="flex justify-between items-center border p-2 rounded-lg mb-2">
                      <span>{icon} {name}</span>
                      <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory({ key, name, icon })}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(key)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Edit Category</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-3 rounded-xl border"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category Icon</label>
                <select
                  value={editingCategory.icon}
                  onChange={handleEditCategoryIconChange}
                  className="w-full p-3 rounded-xl border"
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
                    className="w-full p-3 rounded-xl border"
                    placeholder="Type your icon here"
                  />
                  <div className="flex justify-end space-x-3 mt-2">
                    <button onClick={handleEditCategoryCustomIconCancel} className="px-4 py-2 text-red-500 border border-red-500 rounded-lg font-medium">
                      Cancel
                    </button>
                    <button onClick={handleEditCategoryCustomIconOk} className="px-4 py-2 text-white bg-green-500 rounded-lg font-medium">
                      OK
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setEditingCategory(null)} className="px-4 py-2 border rounded text-red-500 hover:bg-red-50">
                  Cancel
                </button>
                <button onClick={saveEditedCategory} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Editing Section */}
        {selectedExpenseIds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Batch Edit Selected Expenses ({selectedExpenseIds.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Description</label>
                <input
                  type="text"
                  value={batchEditDescription}
                  onChange={(e) => setBatchEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="Enter new description for selected expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Update Category</label>
                <select
                  value={batchEditCategory}
                  onChange={(e) => setBatchEditCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                >
                  <option value="">-- Select new category --</option>
                  {Object.entries(categories).map(([key, { name, icon }]) => (
                    <option key={key} value={key}>
                      {icon} {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={applyAllBatchEdits}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#10B981" }}
              disabled={!batchEditDescription && !batchEditCategory}
            >
              Apply Changes to Selected Expenses
            </button>
          </div>
        )}

        {/* CSV Download Button */}
        {expenses.length > 0 && (
          <div className="mb-6">
            <button
              onClick={downloadCSV}
              className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Download CSV
            </button>
          </div>
        )}

        {/* Expense List Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {Object.keys(categories).map(categoryKey => (
            <CategorySection key={categoryKey} categoryKey={categoryKey} />
          ))}
          {expenses.length > 0 && (
            <div className="mt-8 pt-8 border-t-2">
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-2">Total Expenses:</h2>
                <div className="text-2xl font-bold">{formatCurrency(calculateGrandTotal(), primaryCurrency)}</div>
              </div>
            </div>
          )}
          {expenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No expenses added yet. Start by adding your first expense!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
