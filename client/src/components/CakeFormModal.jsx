import React, { useState, useEffect } from "react";

const CakeFormModal = ({ onClose, onSubmit, existingCake }) => {
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

  useEffect(() => {
    if (existingCake) {
      setFormData({
        ...existingCake,
        tags: existingCake.tags?.join(", ") || "",
        image: null,
      });
    }
  }, [existingCake]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setFormData({ ...formData, image: files[0] });
    else if (type === "checkbox")
      setFormData({ ...formData, [name]: checked });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim())));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (existingCake) onSubmit(existingCake._id, data);
    else onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600">
          {existingCake ? "Edit Cake" : "Add New Cake"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Cake Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="flavor"
            placeholder="Flavor"
            value={formData.flavor}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-2 rounded h-24"
          ></textarea>
          <input
            type="text"
            name="priceRange"
            placeholder="Price Range (e.g. ₹500–₹800)"
            value={formData.priceRange}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <span>Mark as Featured</span>
          </label>
          <input type="file" name="image" onChange={handleChange} className="border p-2 rounded" />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              {existingCake ? "Update Cake" : "Add Cake"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CakeFormModal;
