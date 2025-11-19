'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CartItem, Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export default function ShoppingCart({ isOpen, onClose, onUpdate }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const loadCart = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setCartItems([])
        setLoading(false)
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
    } catch (error) {
      console.error('Sepet yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)

      if (error) throw error

      await loadCart()
      onUpdate?.()
    } catch (error) {
      console.error('Miktar güncelleme hatası:', error)
      alert('Miktar güncellenirken bir hata oluştu')
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      await loadCart()
      onUpdate?.()
    } catch (error) {
      console.error('Ürün silme hatası:', error)
      alert('Ürün silinirken bir hata oluştu')
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-gray-800 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Sepetim</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                Sepete ürün eklemek için giriş yapmalısınız
              </p>
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
                onClick={onClose}
              >
                Giriş Yap
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Sepetiniz boş</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-800 rounded-lg bg-[#0f0f0f]"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-sm font-medium text-white hover:text-blue-400"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {(item.product.price * item.quantity).toFixed(2)} ₺
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded hover:bg-gray-800 text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded hover:bg-gray-800 text-white"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-800 p-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Toplam:</span>
              <span className="text-blue-400">
                {totalPrice.toFixed(2)} ₺
              </span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
              onClick={onClose}
            >
              Ödemeye Geç
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

