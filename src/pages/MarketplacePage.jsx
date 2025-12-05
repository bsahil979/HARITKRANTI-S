"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../redux/slices/inventorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaStore, FaSeedling } from "react-icons/fa";

const MarketplacePage = () => {
  const dispatch = useDispatch();
  const { adminProducts = [], loading: adminLoading } = useSelector((state) => state.inventory || {});

  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    // Fetch admin products for marketplace - visible to customers and farmers
    // Farmer products are NOT shown here - only admin's direct marketplace products
    dispatch(getAdminProducts({ status: "available" }));
  }, [dispatch]);

  // Only show admin products (direct marketplace) - visible to all users (customers, farmers, admin)
  // NO farmer products shown - customers and farmers should not see farmer names
  const allProducts = useMemo(() => {
    // Only map admin products - these are products purchased by admin and listed in marketplace
    const adminProds = (adminProducts || []).map((p) => ({
      ...p,
      _id: p._id,
      name: p.name,
      title: p.name,
      price: p.price || p.pricePerKg,
      pricePerKg: p.pricePerKg || p.price,
      quantity: p.quantity,
      quantityAvailable: p.quantity,
      category: p.category,
      description: p.description,
      images: p.images,
      imageUrl: p.images?.[0],
      unit: p.unit || "kg",
      isAdminProduct: true,
      seller: p.admin,
      sellerType: "admin",
      // Don't show farmer info - customers shouldn't see farmer names
      farmer: null,
      farmerId: null,
    }));

    return adminProds;
  }, [adminProducts]);

  // derive categories from products to populate the category dropdown
  const categories = useMemo(() => {
    const setCat = new Set();
    allProducts.forEach((p) => {
      if (p.category) setCat.add(p.category);
    });
    return ["all", ...Array.from(setCat)];
  }, [allProducts]);

  // filter + sort the products
  const filtered = useMemo(() => {
    let arr = [...allProducts];

    // filter by category
    if (category !== "all") {
      arr = arr.filter((p) => {
        // defensive: category may be different case
        return (p.category || "").toString().toLowerCase() === category.toLowerCase();
      });
    }

    // filter by search (name or description only - no farmer names)
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    // sorting
    if (sort === "priceLowHigh") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "priceHighLow") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "rating") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else {
      // newest: expect createdAt or _id fallback (if Mongo ObjectId, sort by timestamp using string compare)
      arr.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (da || db) return db - da;
        // fallback: if _id is present and looks like ObjectId, newest last -> compare as strings
        if (a._id && b._id) return b._id.localeCompare(a._id);
        return 0;
      });
    }

    return arr;
  }, [allProducts, search, category, sort]);

  if (adminLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-8">
        <FaStore className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Direct Marketplace</h1>
        <p className="text-lg text-gray-600">
          Shop fresh fruits and vegetables from our curated marketplace at fair prices.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-8">
        <input
          type="text"
          placeholder="Search products or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-md px-4 py-2 shadow-sm"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="newest">Newest</option>
          <option value="priceLowHigh">Price: Low → High</option>
          <option value="priceHighLow">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Products grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaSeedling className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600">
            Try changing search terms, category, or sort options.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
