import Cake from "../models/Cake.js";

// ------------------------
// Get all cakes (users)
export const getCakes = async (req, res) => {
  try {
    const cakes = await Cake.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get all categories (users/admin)
export const getCategories = async (req, res) => {
  try {
    const categories = await Cake.distinct("category", { isDeleted: false });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get cakes by category
export const getCakesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const cakes = await Cake.find({ category, isDeleted: false }).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Add a new cake (admin)
export const addCake = async (req, res) => {
  try {
    const { name, description, flavor, category, priceRange, tags, isFeatured } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    const newCake = new Cake({
      name,
      description,
      flavor,
      category,
      priceRange,
      tags: tags ? JSON.parse(tags) : [],
      isFeatured: isFeatured === "true" || false,
      imageUrl,
    });

    const savedCake = await newCake.save();
    res.status(201).json(savedCake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Update cake (admin)
export const updateCake = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, flavor, category, priceRange, tags, isFeatured } = req.body;

    const cake = await Cake.findById(id);
    if (!cake) return res.status(404).json({ message: "Cake not found" });

    cake.name = name || cake.name;
    cake.description = description || cake.description;
    cake.flavor = flavor || cake.flavor;
    cake.category = category || cake.category;
    cake.priceRange = priceRange || cake.priceRange;
    cake.tags = tags ? JSON.parse(tags) : cake.tags;
    cake.isFeatured = isFeatured !== undefined ? isFeatured === "true" : cake.isFeatured;

    if (req.file) cake.imageUrl = req.file.path; // update image if uploaded

    const updatedCake = await cake.save();
    res.json(updatedCake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Soft delete cake (admin)
export const deleteCake = async (req, res) => {
  try {
    const { id } = req.params;
    const cake = await Cake.findById(id);
    if (!cake) return res.status(404).json({ message: "Cake not found" });

    cake.isDeleted = true;
    await cake.save();
    res.json({ message: "Cake deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
