'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

export default function OrdersPage() {
  const [orders, setOrders] = useState<(Order & { order_items: (OrderItem & { product?: any; ebook?: any })[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*),
            ebook:ebooks(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders((data as any) || [])
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Siparişlerinizi görmek için giriş yapmalısınız
        </p>
        <Link
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
        >
          Giriş Yap
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Siparişlerim
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p>Henüz siparişiniz bulunmamaktadır.</p>
          <Link
            href="/products"
            className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
          >
            Alışverişe Başla →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sipariş No: {order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {item.product && (
                      <>
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Miktar: {item.quantity} x {item.price.toFixed(2)} ₺
                          </p>
                        </div>
                      </>
                    )}
                    {item.ebook && (
                      <>
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.ebook.cover_image}
                            alt={item.ebook.title}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/books/${item.ebook.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {item.ebook.title}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.price.toFixed(2)} ₺
                          </p>
                        </div>
                      </>
                    )}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toFixed(2)} ₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  {order.shipping_address && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Teslimat Adresi: {order.shipping_address}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {order.total_amount.toFixed(2)} ₺
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

