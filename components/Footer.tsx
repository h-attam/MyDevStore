import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">My Dev Store</h3>
            <p className="text-gray-400">
              E-kitap ve ürün satışı yapan modern e-ticaret platformu.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  E-Kitaplar
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Hakkımda
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hesap</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Kayıt Ol
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Siparişlerim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@mydevstore.com</li>
              <li>Telefon: +90 XXX XXX XX XX</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} My Dev Store. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

