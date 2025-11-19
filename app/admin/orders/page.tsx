'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Order } from '@/types'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
    loadOrders()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'admin@example.com') {
      router.push('/auth/login?redirect=/admin/orders')
    }
  }

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      loadOrders()
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error)
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
        <h1 className="text-4xl font-bold text-white">Sipariş Yönetimi</h1>
        <Link
          href="/admin"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Geri
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Sipariş No: {order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-400">
                  Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  {order.total_amount.toFixed(2)} ₺
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="bg-[#0f0f0f] border border-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  <option value="pending">Beklemede</option>
                  <option value="processing">İşleniyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
            </div>
            {order.shipping_address && (
              <p className="text-sm text-gray-400">Adres: {order.shipping_address}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

