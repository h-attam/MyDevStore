import { Ebook } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import ebooksData from '@/data/ebooks.json'

export default function BooksPage() {
  const ebooks = ebooksData as Ebook[]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        E-Kitaplar
      </h1>

      {ebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {ebook.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {ebook.author}
                </p>
                {ebook.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {ebook.description}
                  </p>
                )}
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
  )
}

