'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.email !== 'admin@example.com') {
      router.push('/auth/login?redirect=/admin')
      return
    }

    setUser(user)
    setLoading(false)
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
      <h1 className="text-4xl font-bold mb-8 text-white">Admin Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/products"
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">Ürün Yönetimi</h2>
          <p className="text-gray-400">Ürün ekle, düzenle veya sil</p>
        </Link>
        
        <Link
          href="/admin/ebooks"
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">E-Kitap Yönetimi</h2>
          <p className="text-gray-400">E-kitapları yönet</p>
        </Link>
        
        <Link
          href="/admin/orders"
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">Siparişler</h2>
          <p className="text-gray-400">Tüm siparişleri görüntüle</p>
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Hızlı İşlemler</h2>
        <div className="space-y-4">
          <button
            onClick={async () => {
              const response = await fetch('/api/seed', { method: 'POST' })
              const data = await response.json()
              alert(`Örnek veriler eklendi: ${data.products} ürün, ${data.ebooks} e-kitap`)
              window.location.reload()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Örnek Verileri Ekle
          </button>
        </div>
      </div>
    </div>
  )
}

