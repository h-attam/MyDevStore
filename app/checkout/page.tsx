'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CartItem, Product } from '@/types'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      setCartItems((data as any) || [])

      if (!data || data.length === 0) {
        router.push('/products')
      }
    } catch (error) {
      console.error('Sepet yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Demo mod - ödeme simülasyonu
    alert('Demo Mod: Bu özellik şu anda aktif değil. Gerçek ödeme entegrasyonu için Stripe yapılandırması gereklidir.')
    
    setProcessing(true)

    try {
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Demo için sipariş oluştur
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: 'completed',
          shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Sipariş öğelerini oluştur
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      await supabase.from('order_items').insert(orderItems)

      // Sepeti temizle
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      alert('Demo: Sipariş tamamlandı! (Demo modunda)')
      router.push('/orders')
    } catch (error: any) {
      console.error('Demo sipariş hatası:', error)
      alert('Sipariş oluşturulamadı: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Ödeme
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ödeme Formu */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Teslimat Bilgileri
          </h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Teslimat Adresi
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-700 bg-[#0f0f0f] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adres bilgilerinizi giriniz"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'İşleniyor...' : 'Demo: Siparişi Tamamla'}
            </button>
          </form>
        </div>

        {/* Sipariş Özeti */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Sipariş Özeti
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-white">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Miktar: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-white">
                  {(item.product.price * item.quantity).toFixed(2)} ₺
                </p>
              </div>
            ))}
            <div className="border-t border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                  Toplam:
                </span>
                <span className="text-2xl font-bold text-blue-400">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

