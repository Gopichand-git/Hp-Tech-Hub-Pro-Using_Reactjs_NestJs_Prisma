import React, { useEffect, useState, useMemo } from 'react';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from './ProductService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (error) {
      toast.error('❌ Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);


  const hpPavilionCount = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes('hp pavilion') ||
      product.name.toLowerCase().includes('pavilion')
    ).length;
  }, [products]);


  const hpCount = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes('hp')
    ).length;
  }, [products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!form.name.trim()) {
      toast.error('⚠️ Product name is required');
      return;
    }

    if (!form.description.trim()) {
      toast.error('⚠️ Description is required');
      return;
    }

    if (!form.category.trim()) {
      toast.error('⚠️ Category is required');
      return;
    }

    if (!form.imageUrl || !form.imageUrl.trim()) {
      toast.error('⚠️ Image URL is required');
      return;
    }

    if (form.price <= 0) {
      toast.error('⚠️ Price must be greater than 0');
      return;
    }

    if (form.stock < 0) {
      toast.error('⚠️ Stock cannot be negative');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editId !== null) {
        await updateProduct(editId, payload);
        toast.success('✅ Product updated successfully');
        setEditId(null);
      } else {
        await addProduct(payload);
        toast.success('✅ Product added successfully');
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('❌ Submission failed');
      console.error('Submission error:', error);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
    });
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditId(product.id ?? null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success('🗑 Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('❌ Failed to delete product');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80')`,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0" />
      <div className="relative z-10 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src="https://cdn.worldvectorlogo.com/logos/hp-2.svg"
                alt="HP Logo Black"
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
              />

              <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Tech Hub Pro
              </h1>
            </div>

          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 h-fit backdrop-blur-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editId !== null ? 'Update Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Price"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="Stock quantity"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="Category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="Image URL"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
                  >
                    {editId !== null ? 'Update Product' : 'Add Product'}
                  </button>

                  {editId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        resetForm();
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Product List</h2>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  
                  <div className="flex gap-3">
                    
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Total HP: <span className="text-yellow-300 font-bold">{hpCount}</span>
                    </div>
                   
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      HP Pavilion: <span className="text-yellow-300 font-bold">{hpPavilionCount}</span>
                    </div>
                    {searchTerm && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Found: {filteredProducts.length} results
                      </div>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    {searchTerm ? (
                      <>
                        <div className="text-gray-400 mb-4">No products found matching "{searchTerm}"</div>
                        <button
                          onClick={clearSearch}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Clear search to see all products
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-400 mb-4">No products found</div>
                        <p className="text-gray-600">Add your first product using the form</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-5">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white bg-opacity-90 backdrop-blur-sm">
                        <div className="p-5">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800 truncate">{p.name}</h3>
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-lg border-2 border-indigo-300 shadow-md">
                              <span className="font-bold text-sm">₹ {p.price}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{p.description}</p>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-blue-500 text-red-100 px-2 py-1 rounded-md text-xs">
                              {p.category}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${p.stock > 0
                              ? 'bg-green-900 text-green-100'
                              : 'bg-rose-900 text-rose-100'
                              }`}>
                              {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          {p.imageUrl && (
                            <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t border-gray-200">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id!)}
                            className="text-rose-600 hover:text-rose-800 flex items-center"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}