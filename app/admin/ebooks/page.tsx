'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Ebook } from '@/types'
import Link from 'next/link'

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    cover_image: '',
    download_url: '',
  })

  useEffect(() => {
    checkAdmin()
    loadEbooks()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'admin@example.com') {
      router.push('/auth/login?redirect=/admin/ebooks')
    }
  }

  const loadEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEbooks(data || [])
    } catch (error) {
      console.error('E-kitaplar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingEbook) {
        const { error } = await supabase
          .from('ebooks')
          .update({
            title: formData.title,
            author: formData.author,
            price: parseFloat(formData.price),
            description: formData.description,
            cover_image: formData.cover_image,
            download_url: formData.download_url,
          })
          .eq('id', editingEbook.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('ebooks')
          .insert({
            title: formData.title,
            author: formData.author,
            price: parseFloat(formData.price),
            description: formData.description,
            cover_image: formData.cover_image,
            download_url: formData.download_url,
          })

        if (error) throw error
      }

      setShowForm(false)
      setEditingEbook(null)
      setFormData({ title: '', author: '', price: '', description: '', cover_image: '', download_url: '' })
      loadEbooks()
    } catch (error) {
      console.error('E-kitap kaydedilirken hata:', error)
      alert('Hata: ' + (error as Error).message)
    }
  }

  const handleEdit = (ebook: Ebook) => {
    setEditingEbook(ebook)
    setFormData({
      title: ebook.title,
      author: ebook.author,
      price: ebook.price.toString(),
      description: ebook.description || '',
      cover_image: ebook.cover_image,
      download_url: ebook.download_url,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu e-kitabı silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadEbooks()
    } catch (error) {
      console.error('E-kitap silinirken hata:', error)
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
        <h1 className="text-4xl font-bold text-white">E-Kitap Yönetimi</h1>
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
              setEditingEbook(null)
              setFormData({ title: '', author: '', price: '', description: '', cover_image: '', download_url: '' })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showForm ? 'İptal' : 'Yeni E-Kitap Ekle'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {editingEbook ? 'E-Kitap Düzenle' : 'Yeni E-Kitap Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Yazar</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                rows={4}
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Kapak Resmi URL</label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">İndirme URL</label>
              <input
                type="url"
                value={formData.download_url}
                onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {editingEbook ? 'Güncelle' : 'Ekle'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{ebook.title}</h3>
              <p className="text-gray-400 mb-1">{ebook.author}</p>
              <p className="text-blue-400 font-bold">{ebook.price.toFixed(2)} ₺</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(ebook)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(ebook.id)}
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

