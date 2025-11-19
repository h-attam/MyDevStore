import { Product } from '@/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/ProductDetailClient'
import type { Metadata } from 'next'
import productsData from '@/data/products.json'

function getProduct(id: string): Product | null {
  const products = productsData as Product[]
  return products.find(p => p.id === id) || null
}

function getSimilarProducts(category: string, excludeId: string): Product[] {
  const products = productsData as Product[]
  return products
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, 4)
}

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const product = getProduct(params.id)

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    }
  }

  return {
    title: `${product.name} - My Dev Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = getProduct(params.id)
  const similarProducts = product
    ? getSimilarProducts(product.category, product.id)
    : []

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Ürün Resmi */}
        <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Ürün Bilgileri */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            {product.name}
          </h1>
          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-400">
              {product.price.toFixed(2)} ₺
            </span>
          </div>
          <div className="mb-4">
            <span className="inline-block bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {product.description}
          </p>
          <ProductDetailClient product={product} />
        </div>
      </div>

      {/* Benzer Ürünler */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Benzer Ürünler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all"
              >
                <a href={`/products/${similarProduct.id}`} className="block">
                  <div className="relative w-full h-48">
                    <Image
                      src={similarProduct.image_url}
                      alt={similarProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-white">
                      {similarProduct.name}
                    </h3>
                    <p className="text-blue-400 font-bold">
                      {similarProduct.price.toFixed(2)} ₺
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yorumlar Bölümü - Gelecekte eklenebilir */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Yorumlar
        </h2>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-400">
            Yorum özelliği yakında eklenecektir.
          </p>
        </div>
      </div>
    </div>
  )
}

