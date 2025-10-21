import React, { useEffect, useState } from "react";
import { fetchAllCakes } from "../services/cakeService";
import { loginAdmin } from "../services/authService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const API_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

  useEffect(() => {
    const getFeaturedCakes = async () => {
      try {
        const cakes = await fetchAllCakes();
        setFeaturedCakes(cakes.filter(cake => cake.isFeatured));
      } catch (error) {
        console.error("Failed to fetch featured cakes:", error);
      }
    };
    getFeaturedCakes();
  }, []);

  const orderMessage = encodeURIComponent("Hi, I would like to order this cake.");
  const customCakeMessage = encodeURIComponent("Hi, I want a custom cake. Here are the details:");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(adminUsername, adminPassword);
      setShowAdminPopup(false);
      navigate("/admin/dashboard");
    } catch (error) {
      setLoginError(error.message || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Hero Section */}
      <section className="bg-pink-100 flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Sweet Delights
        </motion.h1>
        <motion.p
          className="text-lg max-w-xl mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Home of handcrafted cakes for every occasion. Browse our collection and order your favorite cake or design a custom one!
        </motion.p>
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href={`https://wa.me/${API_WHATSAPP_NUMBER}?text=${orderMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Order Now
          </a>
          <a
            href={`https://wa.me/${API_WHATSAPP_NUMBER}?text=${customCakeMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Custom Cake
          </a>
        </motion.div>
      </section>

      {/* Featured Cakes */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Cakes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredCakes.length > 0 ? (
            featuredCakes.map(cake => (
              <motion.div
                key={cake._id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <img src={cake.imageUrl} alt={cake.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{cake.name}</h3>
                  <p className="text-gray-600">{cake.flavor}</p>
                  <p className="mt-2 font-semibold">{cake.priceRange}</p>
                  <a
                    href={`https://wa.me/${API_WHATSAPP_NUMBER}?text=Hi, I would like to order the "${cake.name}" cake.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full">No featured cakes yet.</p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-12 bg-pink-50 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          Sweet Delights is a family-run bakery crafting personalized cakes for birthdays, weddings, and all special occasions. We believe every cake should be as unique as your celebration!
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Sweet Delights Bakery</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="mailto:contact@sweetdelights.com"
            className="hover:underline"
          >
            Email
          </a>
          <a
            href={`https://wa.me/${API_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            WhatsApp
          </a>
          <button
            onClick={() => setShowAdminPopup(true)}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Admin Login
          </button>
        </div>
      </footer>

      {/* Admin Login Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-8 rounded-lg w-full max-w-md relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            {loginError && <p className="text-red-500 mb-2">{loginError}</p>}
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-4 mt-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                  onClick={() => {
                    setShowAdminPopup(false);
                    setLoginError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
