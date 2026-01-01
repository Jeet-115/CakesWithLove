import React, { useEffect, useState } from "react";
import {
  fetchAllCakes,
  fetchCategories,
  addCake,
  updateCake,
  deleteCake,
} from "../services/cakeService";
import { getAdminToken, logoutAdmin } from "../services/authService";

const AdminPage = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    flavor: "",
    category: "",
    priceRange: "",
    image: null,
    tags: "",
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch cakes & categories
  // -----------------------------
  useEffect(() => {
    if (!getAdminToken()) {
      window.location.href = "/admin-login";
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cakeList, categoryList] = await Promise.all([
        fetchAllCakes(),
        fetchCategories(),
      ]);
      setCakes(cakeList);
      setCategories(categoryList);
    } catch (err) {
      console.error(err);
      alert("Failed to load cakes or categories.");
    }
  };

  // -----------------------------
  // Handle Form Change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // -----------------------------
  // Open Add or Edit Form
  // -----------------------------
  const openForm = (cake = null) => {
    if (cake) {
      setEditingCake(cake);
      setFormData({
        name: cake.name,
        description: cake.description,
        flavor: cake.flavor,
        category: cake.category,
        priceRange: cake.priceRange,
        image: null,
        tags: cake.tags.join(", "),
        isFeatured: cake.isFeatured,
      });
    } else {
      setEditingCake(null);
      setFormData({
        name: "",
        description: "",
        flavor: "",
        category: "",
        priceRange: "",
        image: null,
        tags: "",
        isFeatured: false,
      });
    }
    setShowForm(true);
  };

  // -----------------------------
  // Submit Form (Add or Update)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags") {
        form.append(key, JSON.stringify(value.split(",").map((t) => t.trim())));
      } else {
        form.append(key, value);
      }
    });

    try {
      if (editingCake) {
        await updateCake(editingCake._id, form);
        alert("Cake updated successfully!");
      } else {
        await addCake(form);
        alert("Cake added successfully!");
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving cake.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Soft Delete Cake
  // -----------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cake?")) {
      try {
        await deleteCake(id);
        alert("Cake deleted successfully!");
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Error deleting cake.");
      }
    }
  };

  // -----------------------------
  // Logout Admin
  // -----------------------------
  const handleLogout = () => {
    logoutAdmin();
    window.location.href = "/";
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">🍰 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Add Cake Button */}
      <button
        onClick={() => openForm()}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-pink-600"
      >
        ➕ Add New Cake
      </button>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 relative shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">
              {editingCake ? "Edit Cake" : "Add New Cake"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Cake Name"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                placeholder="Flavor"
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                placeholder="Price Range (e.g. ₹500 - ₹1200)"
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="w-full border p-2 rounded"
              />
              <input type="file" name="image" onChange={handleChange} />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Featured Cake
              </label>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cakes by Category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            {cat} Cakes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cakes
              .filter((cake) => cake.category === cat)
              .map((cake) => (
                <div
                  key={cake._id}
                  className="bg-white rounded-xl shadow-md p-4 border border-pink-100"
                >
                  <img
                    src={cake.imageUrl}
                    alt={cake.name}
                    className="h-40 w-full object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-lg">{cake.name}</h3>
                  <p className="text-gray-600 text-sm">{cake.description}</p>
                  <p className="mt-1 text-sm text-pink-600 font-medium">
                    {cake.priceRange}
                  </p>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => openForm(cake)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cake._id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
