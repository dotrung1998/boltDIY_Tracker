import React, { useState } from "react";

const ExpenseTracker = () => {
  // Expense input state
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [category, setCategory] = useState("eating");

  // Predefined categories with emojis
  const [categories, setCategories] = useState({
    eating: { name: "Eating in the restaurant", icon: "🍽️" },
    groceries: { name: "Groceries", icon: "🛒" },
    furniture: { name: "Furniture", icon: "🪑" },
    other: { name: "Other", icon: "📦" }
  });

  // State for adding new category
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  
  // State for custom icon modal
  const [showCustomIconModal, setShowCustomIconModal] = useState(false);
  const [customIcon, setCustomIcon] = useState("");

  // State for selecting primary currency for totals
  const [primaryCurrency, setPrimaryCurrency] = useState("EUR");

  // Defined currencies with exchange rates
  const currencies = {
    EUR: { symbol: "€", rate: 25000 },
    USD: { symbol: "$", rate: 23000 },
    VND: { symbol: "₫", rate: 1 }
  };

  // Conversion: Convert any amount from its source currency to target currency.
  const convertAmountTo = (amount, fromCurrency, toCurrency) => {
    return amount * (currencies[fromCurrency].rate / currencies[toCurrency].rate);
  };

  // Formatting amounts in desired currency
  const formatCurrency = (value, curr) => {
    if (curr === "VND") {
      return `₫${Math.round(value).toLocaleString("vi-VN")}`;
    }
    return `${currencies[curr].symbol}${value.toFixed(2)} ${curr}`;
  };

  // Handle adding a new expense
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      currency,
      category
    };
    setExpenses([...expenses, newExpense]);
    setAmount("");
    setDescription("");
  };

  // Delete a category along with its expenses
  const deleteCategory = (categoryKey) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((exp) => exp.category !== categoryKey)
    );
    setCategories((prevCategories) => {
      const updated = { ...prevCategories };
      delete updated[categoryKey];
      return updated;
    });
  };

  // Delete a specific expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Calculate grand total in the primary currency
  const calculateGrandTotal = () => {
    return expenses.reduce(
      (sum, exp) =>
        sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
      0
    );
  };

  // Component for displaying a single category and its expenses converted to primary currency
  const CategorySection = ({ categoryKey }) => {
    const categoryExpenses = expenses.filter((exp) => exp.category === categoryKey);
    if (categoryExpenses.length === 0) return null;

    const total = categoryExpenses.reduce(
      (sum, exp) =>
        sum + convertAmountTo(exp.amount, exp.currency, primaryCurrency),
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
          {categoryExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between p-4 bg-gray-50 rounded-lg mb-2 relative"
            >
              <span className="text-lg">{expense.description}</span>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(expense.amount, expense.currency)}
                </div>
                <div className="text-gray-500">
                  ({formatCurrency(convertAmountTo(expense.amount, expense.currency, primaryCurrency), primaryCurrency)})
                </div>
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="absolute bottom-2 left-2 text-red-500 text-sm hover:underline"
              >
                x
              </button>
            </div>
          ))}
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

  // Handler when changing the category icon select list
  const handleCategoryIconChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomIconModal(true);
      setNewCategory({ ...newCategory, icon: "" });
    } else {
      setNewCategory({ ...newCategory, icon: value });
    }
  };

  // Confirm custom icon from modal
  const handleCustomIconOk = () => {
    if (customIcon.trim()) {
      setNewCategory({ ...newCategory, icon: customIcon });
    }
    setCustomIcon("");
    setShowCustomIconModal(false);
  };

  // Cancel custom icon selection
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
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="Enter expense description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border"
                  placeholder="Enter amount"
                  step="0.01"
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
              Add Expense
            </button>
          </form>
        </div>

        {/* Manage Categories Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
          
          {/* New Category Form */}
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
          
          {/* Modal for custom icon input */}
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

          {/* List current categories for deletion */}
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

        {/* Expense List Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {Object.keys(categories).map((categoryKey) => (
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
