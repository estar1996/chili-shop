"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export default function ProductsAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 상품 목록 조회
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('상품 목록 조회 시작...');
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        console.log('Supabase 연결 정보:', {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        });
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) {
          console.error('Supabase 쿼리 오류:', error);
          throw error;
        }
        
        console.log('조회된 상품 데이터:', data);
        setProducts(data || []);
      } catch (error) {
        console.error('상품 목록 조회 중 오류가 발생했습니다:', error);
        toast({
          title: "상품 목록 조회 실패",
          description: "상품 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 검색 결과 필터링
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 상품 삭제 기능
  const handleDelete = async (productId: number) => {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // 화면에서도 삭제
      setProducts(products.filter(product => product.id !== productId));
      
      toast({
        title: "상품 삭제 완료",
        description: "상품이 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      console.error('상품 삭제 중 오류가 발생했습니다:', error);
      toast({
        title: "상품 삭제 실패",
        description: "상품을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">상품 관리</h2>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/admin/products/add')}>
          상품 추가
        </Button>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>상품 목록</CardTitle>
            <CardDescription>등록된 상품 목록을 관리하고 수정할 수 있습니다.</CardDescription>
            <div className="mt-4">
              <Input
                placeholder="상품명 또는 설명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">데이터를 불러오는 중입니다...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-4">
                {searchTerm ? (
                  <p>검색 결과가 없습니다.</p>
                ) : (
                  <p>등록된 상품이 없습니다. 새 상품을 추가해주세요.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">이미지</th>
                      <th className="py-3 px-4 text-left">상품명</th>
                      <th className="py-3 px-4 text-left">가격</th>
                      <th className="py-3 px-4 text-left">카테고리</th>
                      <th className="py-3 px-4 text-left">재고</th>
                      <th className="py-3 px-4 text-left">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl">🌶️</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4">{product.price?.toLocaleString() || 0}원</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.stock || '재고 정보 없음'}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            >
                              수정
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              삭제
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 