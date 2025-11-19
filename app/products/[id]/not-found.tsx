import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        404 - Ürün Bulunamadı
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
      </p>
      <Link
        href="/products"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
      >
        Ürünlere Dön
      </Link>
    </div>
  )
}

