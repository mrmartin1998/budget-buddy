const Category = {
    id: String,
    userId: String,
    name: String,          // e.g., "Groceries", "Salary", "Freelance"
    type: String,          // "income" or "expense"
    icon: String,          // Optional: for visual representation
    color: String,         // Optional: for charts and UI
    isCustom: Boolean,     // To distinguish between default and custom categories
    createdAt: Date,
    updatedAt: Date
  };

export default Category;