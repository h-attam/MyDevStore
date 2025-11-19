'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  // Debug: Product props kontrolü
  if (!product) {
    console.error('❌ ProductCard: product prop eksik!')
    return null
  }

  if (!product.id || !product.name || !product.price || !product.image_url) {
    console.error('❌ ProductCard: Eksik product bilgileri:', product)
    return null
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Sepete eklemek için giriş yapmalısınız')
        setIsAdding(false)
        return
      }

      // Sepette aynı ürün var mı kontrol et
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        // Miktarı artır
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        // Yeni ürün ekle
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          })
      }

      onAddToCart?.()
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      alert('Sepete eklenirken bir hata oluştu')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 flex flex-col">
      <Link href={`/products/${product.id}`} className="relative w-full h-64">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 text-white hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-blue-400">
            {product.price.toFixed(2)} ₺
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}
          </button>
        </div>
        
        <span className="text-xs text-gray-500 mt-2">
          {product.category}
        </span>
      </div>
    </div>
  )
}

