import React, { useState } from "react";

    const ExpenseTracker = () => {
      const [expenses, setExpenses] = useState([]);
      const [amount, setAmount] = useState("");
      const [description, setDescription] = useState("");
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
      const [primaryCurrency, setPrimaryCurrency] = useState("EUR");
      const [editingExpenseId, setEditingExpenseId] = useState(null);
      const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);
      const [batchEditDescription, setBatchEditDescription] = useState("");

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
            category
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

      const applyBatchEditDescription = () => {
        if (batchEditDescription.trim() === "") return;
        const updatedExpenses = expenses.map(exp =>
          selectedExpenseIds.includes(exp.id) ? { ...exp, description: batchEditDescription } : exp
        );
        setExpenses(updatedExpenses);
        setSelectedExpenseIds([]);
        setBatchEditDescription("");
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

      // Download CSV summary of expenses.
      const downloadCSV = () => {
        const headers = ["ID", "Description", "Amount", "Currency", "Category"];
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(","));

        // Add expense data
        expenses.forEach(exp => {
          const categoryName = categories[exp.category] ? categories[exp.category].name : exp.category;
          csvRows.push([exp.id, `"${exp.description}"`, exp.amount, exp.currency, `"${categoryName}"`].join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.href = url;
        a.download = "SharedSpend_summary.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      const InlineEditExpense = ({ expense, onSave, onCancel }) => {
        const [editData, setEditData] = useState({
          description: expense.description,
          amount: expense.amount.toString(),
          currency: expense.currency,
          category: expense.category
        });

        // Use functional setState for ALL updates within InlineEditExpense
        const handleDescriptionChange = (e) => {
          setEditData(prevEditData => ({ ...prevEditData, description: e.target.value }));
        };

        const handleAmountChange = (e) => {
          setEditData(prevEditData => ({ ...prevEditData, amount: e.target.value }));
        };

        const handleCurrencyChange = (e) => {
          setEditData(prevEditData => ({ ...prevEditData, currency: e.target.value }));
        };

        const handleCategoryChange = (e) => {
          setEditData(prevEditData => ({ ...prevEditData, category: e.target.value }));
        };


        return (
          <div className="p-4 bg-gray-100 rounded-lg mb-2">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <input
                  type="text"
                  value={editData.description}
                  onChange={handleDescriptionChange} // Use the functional update handler
                  className="w-full p-2 rounded border"
                  placeholder="Description"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={editData.amount}
                  onChange={handleAmountChange} // Use the functional update handler
                  className="w-full p-2 rounded border"
                  placeholder="Amount"
                />
              </div>
              <div>
                <select
                  value={editData.currency}
                  onChange={handleCurrencyChange} // Use the functional update handler
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
                  onChange={handleCategoryChange} // Use the functional update handler
                  className="w-full p-2 rounded border"
                >
                  {Object.entries(categories).map(([key, { name, icon }]) => (
                    <option key={key} value={key}>
                      {icon} {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={onCancel}
                className="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
              >
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

      const CategorySection = ({ categoryKey }) => {
        const categoryExpenses = expenses.filter(exp => exp.category === categoryKey);
        if (categoryExpenses.length === 0) return null;

        const total = categoryExpenses.reduce(
          (sum, exp) => sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
          0
        );

        return (
          <div className="mb-8 relative">
            <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
              {categories[categoryKey].icon} {categories[categoryKey].name}
              <button
                onClick={() => deleteCategory(categoryKey)}
                className="text-red-500 text-lg hover:underline"
              >
                x
              </button>
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
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2 relative"
                  >
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
                      Description (separate multiple entries with ";" or "+")
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-xl border"
                      placeholder="e.g., Rossmann (optional)"
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
                  className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F1C4D9" }}
                >
                  Add Expense(s)
                </button>
              </form>
            </div>

            {/* Manage Categories Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
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
                      {[
                        "🍽️",
                        "🛒",
                        "🪑",
                        "📦",
                        "💻",
                        "🏠",
                        "🚗",
                        "🍎",
                        "🍹"
                      ].map((emoji, idx) => (
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
                      <button
                        onClick={handleCustomIconCancel}
                        className="px-4 py-2 text-red-500 border border-red-500 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCustomIconOk}
                        className="px-4 py-2 text-white bg-green-500 rounded-lg font-medium"
                      >
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
                      <span>
                        {icon} {name}
                      </span>
                      <button
                        onClick={() => deleteCategory(key)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Batch Editing Section */}
            {selectedExpenseIds.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Batch Edit Selected Expenses</h2>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={batchEditDescription}
                    onChange={(e) => setBatchEditDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border"
                    placeholder="Enter new description for selected expenses"
                  />
                  <button
                    onClick={applyBatchEditDescription}
                    className="w-full p-3 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: "#10B981" }}
                  >
                    Update Descriptions
                  </button>
                </div>
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
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculateGrandTotal(), primaryCurrency)}
                    </div>
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
