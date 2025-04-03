"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Order {
  id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  message: string | null;
  status: string;
  created_at: string;
  products: {
    name: string;
    price: number;
    image_url: string | null;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('주문 정보 조회 중 오류가 발생했습니다:', error);
      toast({
        title: "오류",
        description: "주문 정보를 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문을 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/admin/orders">주문 목록으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">주문 상세 정보</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          뒤로 가기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 주문 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>주문 정보</CardTitle>
            <CardDescription>주문 번호: #{order.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-600">주문일시</dt>
                <dd>{formatDate(order.created_at)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">주문 상태</dt>
                <dd>{order.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">결제 금액</dt>
                <dd className="font-bold">{order.total_price.toLocaleString()}원</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* 상품 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                {order.products.image_url ? (
                  <img
                    src={order.products.image_url}
                    alt={order.products.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🌶️
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{order.products.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {order.products.price.toLocaleString()}원 × {order.quantity}개
                </p>
                <p className="font-bold">
                  총 {(order.products.price * order.quantity).toLocaleString()}원
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 주문자 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>주문자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-600">이름</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">연락처</dt>
                <dd>{order.customer_phone}</dd>
              </div>
              {order.customer_email && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">이메일</dt>
                  <dd>{order.customer_email}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* 배송 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>배송 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-600">배송지 주소</dt>
                <dd className="text-right">{order.shipping_address}</dd>
              </div>
              {order.message && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">배송 메시지</dt>
                  <dd className="text-right">{order.message}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 