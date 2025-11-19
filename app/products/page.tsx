'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

export default function ProductsPage() {
  const [products] = useState<Product[]>(productsData as Product[])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData as Product[])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [categories] = useState<string[]>(categoriesData.filter(c => c !== 'Tümü'))

  useEffect(() => {
    filterProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, priceRange])

  const filterProducts = () => {
    let filtered = [...products]

    // Arama
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Fiyat aralığı
    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    )

    setFilteredProducts(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Tüm Ürünler
      </h1>

      {/* Filtreler */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Arama
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Fiyat Aralığı */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Fiyat Aralığı: {priceRange.min}₺ - {priceRange.max}₺
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
                placeholder="Min"
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                }
                placeholder="Max"
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="mb-4 text-gray-400">
        {filteredProducts.length} ürün bulundu
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>Ürün bulunamadı.</p>
        </div>
      )}
    </div>
  )
}

