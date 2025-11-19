'use client'

import { useState, useEffect } from 'react'
import { Ebook } from '@/types'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface EbookPurchaseClientProps {
  ebook: Ebook
}

export default function EbookPurchaseClient({ ebook }: EbookPurchaseClientProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUserAndPurchase()
  }, [])

  const checkUserAndPurchase = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      // Kullanıcının bu e-kitabı satın alıp almadığını kontrol et
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')

      const purchased = orders?.some((order) =>
        order.order_items?.some((item: any) => item.ebook_id === ebook.id)
      )

      setHasPurchased(purchased || false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Demo mod - ödeme simülasyonu
    alert('Demo Mod: Bu özellik şu anda aktif değil. Gerçek ödeme entegrasyonu için Stripe yapılandırması gereklidir.')
    
    // Demo için sipariş oluştur
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: ebook.price,
          status: 'completed',
        })
        .select()
        .single()

      if (orderError) throw orderError

      await supabase.from('order_items').insert({
        order_id: order.id,
        ebook_id: ebook.id,
        quantity: 1,
        price: ebook.price,
      })

      alert('Demo: E-kitap satın alındı! (Demo modunda)')
      checkUserAndPurchase()
    } catch (error) {
      console.error('Demo sipariş hatası:', error)
    }
  }

  const handleDownload = async () => {
    if (!user || !hasPurchased) return

    try {
      // İndirme linkini al (Supabase Storage'dan)
      const { data, error } = await supabase.storage
        .from('ebook-files')
        .createSignedUrl(ebook.download_url, 3600) // 1 saat geçerli link

      if (error) throw error

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (error) {
      console.error('İndirme hatası:', error)
      alert('İndirme linki oluşturulamadı')
    }
  }

  if (hasPurchased) {
    return (
      <div className="space-y-4">
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded">
          Bu e-kitabı satın aldınız!
        </div>
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          İndir
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'İşleniyor...' : 'Demo: Satın Al'}
    </button>
  )
}

