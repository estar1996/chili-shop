"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 주문 상태 옵션
const ORDER_STATUS = {
  '주문 접수': '주문 접수',
  '입금 확인': '입금 확인',
  '배송 준비중': '배송 준비중',
  '배송중': '배송중',
  '배송 완료': '배송 완료',
  '주문 취소': '주문 취소'
} as const;

type OrderStatus = keyof typeof ORDER_STATUS;

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
  status: OrderStatus;
  created_at: string;
  products: {
    name: string;
    price: number;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('주문 데이터 조회 시작...');
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      console.log('Supabase 연결 정보:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            name,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('주문 데이터 조회 오류:', error);
        throw error;
      }

      console.log('조회된 주문 데이터:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('주문 목록 조회 중 오류가 발생했습니다:', error);
      toast({
        title: "오류",
        description: "주문 목록을 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // 상태 업데이트 성공 시 목록 새로고침
      await fetchOrders();

      toast({
        title: "상태 변경 완료",
        description: "주문 상태가 변경되었습니다.",
      });
    } catch (error) {
      console.error('주문 상태 변경 중 오류가 발생했습니다:', error);
      toast({
        title: "오류",
        description: "주문 상태를 변경할 수 없습니다.",
        variant: "destructive",
      });
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case '주문 접수':
        return 'text-blue-600';
      case '입금 확인':
        return 'text-green-600';
      case '배송 준비중':
        return 'text-yellow-600';
      case '배송중':
        return 'text-purple-600';
      case '배송 완료':
        return 'text-gray-600';
      case '주문 취소':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <Button onClick={() => fetchOrders()}>새로고침</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문번호</TableHead>
                <TableHead>주문일시</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>총 금액</TableHead>
                <TableHead>주문자</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{order.products.name}</TableCell>
                  <TableCell>{order.quantity}개</TableCell>
                  <TableCell>{order.total_price.toLocaleString()}원</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_phone}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value: OrderStatus) => 
                        updateOrderStatus(order.id, value)
                      }
                    >
                      <SelectTrigger className={`w-[140px] ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORDER_STATUS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/orders/${order.id}`}>
                        상세보기
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 