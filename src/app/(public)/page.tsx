'use client';

import SearchForm from '@/components/SearchForm';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero Section - Clean & Minimal */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950 dark:via-gray-900 dark:to-teal-950">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-emerald-100 dark:border-emerald-800 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Al-Quran Digital</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Si<span className="text-emerald-600 dark:text-emerald-400">KAJI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Platform Kajian Islam Modern
          </p>
          
          {/* Search Card */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <SearchForm />
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">114</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Surah</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">6.236</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ayat</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">30+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tafsir</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Surahs Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Surah Populer</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Akses cepat ke surah yang sering dibaca</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { num: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', desc: 'Pembukaan', ayah: 7 },
            { num: 36, name: 'Yasin', arabic: 'يس', desc: 'Yasin', ayah: 83 },
            { num: 55, name: 'Ar-Rahman', arabic: 'الرحمن', desc: 'Maha Pemurah', ayah: 78 },
            { num: 67, name: 'Al-Mulk', arabic: 'الملك', desc: 'Kerajaan', ayah: 30 },
            { num: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', desc: 'Keesaan', ayah: 4 },
          ].map((surah) => (
            <Link
              key={surah.num}
              href={`/search?q=surah ${surah.num}`}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300"
            >
              <div className="text-3xl font-arabic text-emerald-600 dark:text-emerald-400 mb-2">{surah.arabic}</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {surah.name}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{surah.desc} • {surah.ayah} ayat</div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link href="/surah" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium inline-flex items-center gap-1">
            Lihat semua surah
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fitur Lengkap</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Semua yang Anda butuhkan dalam satu platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Al-Quran Digital</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Teks Arab & terjemahan Indonesia yang mudah dipahami</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tafsir Lengkap</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Penjelasan mendalam dari berbagai ulama terpercaya</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Smart Search</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Cari ayat atau surah dengan cepat dan akurat</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Mulai Perjalanan Belajarmu</h3>
              <p className="text-white/80 mb-6">Daftar sekarang untuk pengalaman belajar yang lebih personal</p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="bg-white text-emerald-600 px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Daftar Gratis
                </Link>
                <Link 
                  href="/login" 
                  className="border-2 border-white text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            "Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya"
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">— HR. Bukhari</p>
          <p className="text-gray-300 dark:text-gray-600 text-xs mt-4">© 2024 SiKAJI • Platform Kajian Islam</p>
        </div>
      </footer>
    </div>
  );
}