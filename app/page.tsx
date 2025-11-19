import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product, Ebook } from '@/types'
import Image from 'next/image'
import productsData from '@/data/products.json'
import ebooksData from '@/data/ebooks.json'

export default function Home() {
  // İlk 6 ürünü featured olarak göster
  const products = (productsData as Product[]).slice(0, 6)
  // İlk 3 e-kitabı featured olarak göster
  const ebooks = (ebooksData as Ebook[]).slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white py-20 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hoş Geldiniz
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              E-kitap ve ürün satışı yapan modern e-ticaret platformu. 
              Ayrıca portfolyom ve projelerimi keşfedin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ürünleri İncele
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Hakkımda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              Öne Çıkan Ürünler
            </h2>
            <Link
              href="/products"
              className="text-blue-400 hover:underline"
            >
              Tümünü Gör →
            </Link>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Henüz ürün bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured E-books */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              Öne Çıkan E-Kitaplar
            </h2>
            <Link
              href="/books"
              className="text-blue-400 hover:underline"
            >
              Tümünü Gör →
            </Link>
          </div>
          
          {ebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ebooks.map((ebook) => (
                <Link
                  key={ebook.id}
                  href={`/books/${ebook.id}`}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={ebook.cover_image}
                      alt={ebook.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {ebook.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {ebook.author}
                    </p>
                    <p className="text-2xl font-bold text-blue-400">
                      {ebook.price.toFixed(2)} ₺
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Henüz e-kitap bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Summary */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Hakkımda
            </h2>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Merhaba! Ben bir full-stack developer'ım ve bu platform hem e-ticaret 
                hem de kişisel portfolyom olarak hizmet veriyor. Burada e-kitap ve 
                çeşitli ürünler satıyorum, ayrıca yaptığım projeleri ve deneyimlerimi 
                paylaşıyorum.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-full text-sm font-medium">
                  Next.js
                </span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-full text-sm font-medium">
                  TypeScript
                </span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-full text-sm font-medium">
                  Supabase
                </span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-full text-sm font-medium">
                  Tailwind CSS
                </span>
              </div>
              <Link
                href="/about"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

