'use client';
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useCart } from "../_context/CartContext";
import { useSearch } from "../_context/SearchContext";
import { useLocation } from "../_context/LocationContext";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false); // NEW
  const [inputValues, setInputValues] = useState({});

  const { cart, updateCartItem } = useCart();
  const { searchQuery, categoryFilter } = useSearch();
  const { location } = useLocation();

  const getBranchId = () => {
    if (location?.branchId) return location.branchId;
    const stored = localStorage.getItem("selectedLocation");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.branchId;
      } catch {
        console.error("Invalid selectedLocation in localStorage");
      }
    }
    return null;
  };

  // Load user role from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const roleName = parsed?.role?.[0]?.RoleName || "";
        setUserRole(roleName);
      } catch {
        console.error("Invalid user data");
      }
    }
    setRoleLoaded(true); // ✅ Mark as loaded
  }, []);

  // Fetch products
  useEffect(() => {
    const branchId = getBranchId();
    if (!branchId) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      const endpoint = token ? `/userproducts` : `/products/${branchId}`;
      setLoading(true);

      try {
        const res = await api.get(endpoint);
        const data = res.data;

        if (Array.isArray(data)) {
          setAllProducts(data);
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setAllProducts(data.products);
          setProducts(data.products);
        } else {
          setAllProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location?.branchId]);

  // Filter by search + category
  useEffect(() => {
    let filtered = [...allProducts];
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        (p.ProductName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ProductUnicodeName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter((p) =>
        p.CategoryName && p.CategoryName.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    setProducts(filtered);
  }, [searchQuery, categoryFilter, allProducts]);

  const changeQuantity = (product, change) => {
    const currentQty = cart[product.ProductID]?.quantity || 0;
    const newQty = Math.max(0, currentQty + change);
    updateCartItem(product, newQty);
    setInputValues(prev => ({ ...prev, [product.ProductID]: String(newQty) }));
  };

  const calculateTotal = (product) => {
    const qty = cart[product.ProductID]?.quantity || 0;
    const price = parseFloat(product.Price);
    return (qty * price).toFixed(2);
  };

  const branchId = getBranchId();

  // ✅ Wait until role + product loading done
  if (!roleLoaded || loading) {
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (!branchId) {
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-5">Select a location to view products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center mt-5">No products found.</p>;
  }

  return (
    <div className="container" style={{ paddingTop: '9rem' }}>
      <h3 className="mb-4 text-center">Our Products</h3>
      <div className="row">
        {products.map((product) => (
          <div key={product.ProductID} className="col-6 col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-3">
                <img
                  src={product.Picture}
                  alt={product.ProductName}
                  className="img-fluid rounded"
                  style={{ height: '100px', objectFit: 'cover' }}
                />
                <h6 className="mt-2">{product.ProductName}</h6>
                <small className="text-muted">
                  ({product.ProductUnicodeName || "—"})<br />
                  ₹{product.Price} / {product.UnitName}
                </small>

                <div className="d-flex justify-content-center align-items-center mt-2">
                  {userRole === "Institution" || userRole === "Hotel" ? (
                    <input
                      type="text"
                      value={
                        inputValues[product.ProductID] !== undefined
                          ? inputValues[product.ProductID]
                          : cart[product.ProductID]?.quantity || ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(val)) {
                          setInputValues(prev => ({
                            ...prev,
                            [product.ProductID]: val
                          }));
                          if (val !== "" && !val.endsWith(".")) {
                            updateCartItem(product, parseFloat(val));
                          }
                        }
                      }}
                      className="form-control text-center"
                      style={{ width: '4rem' }}
                      placeholder="0"
                    />
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => changeQuantity(product, -1)}
                      >-</button>
                      <input
                        readOnly
                        value={cart[product.ProductID]?.quantity || 0}
                        className="form-control text-center mx-2"
                        style={{ width: '3rem' }}
                      />
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => changeQuantity(product, 1)}
                      >+</button>
                    </>
                  )}
                </div>

                <div className="mt-2">
                  <small>Total:</small> ₹{calculateTotal(product)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
