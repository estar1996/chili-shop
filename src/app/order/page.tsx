"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('상품 정보 조회 중 오류가 발생했습니다:', error);
        toast({
          title: "오류",
          description: "상품 정보를 불러올 수 없습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('주문 처리 시작...');
      console.log('주문 데이터:', {
        productId,
        quantity,
        formData
      });

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      console.log('Supabase 연결 정보:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });

      // 주문 정보 저장
      const orderData = {
        product_id: productId,
        quantity: quantity,
        total_price: product.price * quantity,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_address: formData.address,
        message: formData.message,
        status: '주문 접수',
        created_at: new Date().toISOString(),
      };

      console.log('저장할 주문 데이터:', orderData);

      const { data, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error('주문 저장 오류:', orderError);
        throw orderError;
      }

      console.log('저장된 주문 데이터:', data);

      toast({
        title: "주문 완료",
        description: "주문이 성공적으로 접수되었습니다.",
      });

      // 주문 완료 페이지로 이동
      router.push('/order/complete');
    } catch (error) {
      console.error('주문 처리 중 오류가 발생했습니다:', error);
      toast({
        title: "주문 실패",
        description: "주문을 처리하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

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
        <h1 className="text-2xl font-bold mb-8">주문하기</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 주문 양식 */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">전화번호 <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">배송지 주소 <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">배송 메시지</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="배송 시 요청사항을 입력해주세요"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={submitting}
              >
                {submitting ? "주문 처리 중..." : "주문하기"}
              </Button>
            </form>
          </div>

          {/* 주문 요약 */}
          <div className="bg-white p-6 border rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">주문 상품 정보</h2>
            
            <div className="flex gap-4 mb-6">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-2xl">
                  🌶️
                </div>
              )}
              
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-sm">{product.price?.toLocaleString()}원 × {quantity}개</p>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{product.price?.toLocaleString()}원</span>
              </div>
              
              <div className="flex justify-between">
                <span>수량</span>
                <span>{quantity}개</span>
              </div>
              
              <div className="flex justify-between">
                <span>배송비</span>
                <span>3,000원</span>
              </div>
            </div>
            
            <div className="border-t border-gray-400 mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>총 결제 금액</span>
                <span className="text-red-600">{(totalPrice + 3000).toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded text-sm text-gray-600">
              <h3 className="font-medium text-gray-800 mb-2">결제 안내</h3>
              <p>
                주문 접수 후 아래 계좌로 입금해 주시면 확인 후 배송이 시작됩니다.
              </p>
              <p className="mt-2">
                <span className="font-medium">농협은행</span> 123-456-7890 (예금주: 명품고춧가루)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <OrderContent />
    </Suspense>
  );
} 