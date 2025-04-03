"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  weight: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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
      toast({
        title: "오류",
        description: "상품 목록을 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              🌶️ 명품 고춧가루
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/products" className="hover:text-red-600">상품</Link>
              <Link href="/company" className="hover:text-red-600">회사 소개</Link>
              <Link href="/contact" className="hover:text-red-600">문의하기</Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">상품 목록</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id}
              href={`/products/${product.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-4 aspect-h-3 bg-gray-100">
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
                <h2 className="font-medium mb-1">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {product.price.toLocaleString()}원
                  </span>
                  <Button size="sm">
                    구매하기
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 