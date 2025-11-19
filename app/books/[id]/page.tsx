import { Ebook } from '@/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import EbookPurchaseClient from '@/components/EbookPurchaseClient'
import type { Metadata } from 'next'
import ebooksData from '@/data/ebooks.json'

function getEbook(id: string): Ebook | null {
  const ebooks = ebooksData as Ebook[]
  return ebooks.find(e => e.id === id) || null
}

export function generateMetadata({
  params,
}: {
  params: { id: string }
}): Metadata {
  const ebook = getEbook(params.id)

  if (!ebook) {
    return {
      title: 'E-Kitap Bulunamadı',
    }
  }

  return {
    title: `${ebook.title} - My Dev Store`,
    description: ebook.description || `Yazar: ${ebook.author}`,
    openGraph: {
      title: ebook.title,
      description: ebook.description || `Yazar: ${ebook.author}`,
      images: [ebook.cover_image],
    },
  }
}

export default function EbookDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const ebook = getEbook(params.id)

  if (!ebook) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* E-Kitap Kapağı */}
        <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={ebook.cover_image}
            alt={ebook.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* E-Kitap Bilgileri */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            {ebook.title}
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Yazar: {ebook.author}
          </p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-400">
              {ebook.price.toFixed(2)} ₺
            </span>
          </div>
          {ebook.description && (
            <p className="text-gray-300 mb-6 leading-relaxed">
              {ebook.description}
            </p>
          )}
          <EbookPurchaseClient ebook={ebook} />
        </div>
      </div>
    </div>
  )
}

