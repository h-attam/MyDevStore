'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category: '',
  })

  useEffect(() => {
    checkAdmin()
    loadProducts()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'admin@example.com') {
      router.push('/auth/login?redirect=/admin/products')
    }
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        // Güncelle
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
          })
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // Yeni ekle
        const { error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
          })

        if (error) throw error
      }

      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: '', price: '', description: '', image_url: '', category: '' })
      loadProducts()
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error)
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image_url: product.image_url,
      category: product.category,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadProducts()
    } catch (error) {
      console.error('Ürün silinirken hata:', error)
      alert('Hata: ' + (error as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Ürün Yönetimi</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Geri
          </Link>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingProduct(null)
              setFormData({ name: '', price: '', description: '', image_url: '', category: '' })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? 'İptal' : 'Yeni Ürün Ekle'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Ürün Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Fiyat</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Resim URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Kategori</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {editingProduct ? 'Güncelle' : 'Ekle'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-1">{product.category}</p>
              <p className="text-blue-400 font-bold">{product.price.toFixed(2)} ₺</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

