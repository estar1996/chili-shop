"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('상품 목록 조회 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              🌶️ 놀라운 고추
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/products" className="hover:text-green-600">상품</Link>
              <Link href="/inquiry" className="hover:text-green-600">문의하기</Link>
              <Link href="/admin" className="hover:text-green-600">관리자</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-red-500 to-red-700 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              대한민국 대표 고춧가루<br />
              명품 고춧가루
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              3대째 이어온 전통 방식으로<br />
              정성껏 만든 최고급 고춧가루를 만나보세요
            </p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              지금 구매하기
            </Button>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌶️</div>
              <h3 className="text-xl font-bold mb-2">최상급 원료</h3>
              <p className="text-gray-600">
                햇고추만을 엄선하여<br />
                신선한 품질을 보장합니다
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <h3 className="text-xl font-bold mb-2">전통 방식</h3>
              <p className="text-gray-600">
                3대째 이어온 전통 제조 방식으로<br />
                깊은 맛을 선사합니다
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">품질 보증</h3>
              <p className="text-gray-600">
                HACCP 인증을 받은 시설에서<br />
                안전하게 생산됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 상품 목록 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">인기 상품</h2>
            <p className="text-gray-600 mb-8">최고 품질의 국내산 고춧가루를 만나보세요</p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                전체 상품 보기
              </Link>
              <Link href="/inquiry" className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors">
                문의하기
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">데이터를 불러오는 중입니다...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🌶️
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                      <h3 className="font-medium mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{product.price?.toLocaleString()}원</span>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          구매하기
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">명품 고춧가루</h3>
              <p className="text-gray-400">최고 품질의 국내산 고춧가루</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">연락처</h3>
              <p className="text-gray-400">전화: 010-1234-5678</p>
              <p className="text-gray-400">이메일: info@chilishop.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">빠른 링크</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white">상품</Link></li>
                <li><Link href="/inquiry" className="text-gray-400 hover:text-white">문의하기</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 명품 고춧가루. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
