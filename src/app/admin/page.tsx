"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardData {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  popularProduct: string;
  recentOrders: any[];
  recentInquiries: any[];
}

export default function AdminPage() {
  const [data, setData] = useState<DashboardData>({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    popularProduct: '',
    recentOrders: [],
    recentInquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // 주문 데이터 조회
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // 문의 데이터 조회
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (inquiriesError) throw inquiriesError;

      // 대시보드 데이터 계산
      const totalOrders = orders?.length || 0;
      const totalSales = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === '주문 접수' || order.status === '입금 확인').length || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setData({
        totalOrders,
        totalSales,
        pendingOrders,
        popularProduct: recentOrders[0]?.products?.name || '',
        recentOrders,
        recentInquiries: inquiries || []
      });
    } catch (error) {
      console.error('대시보드 데이터 조회 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">총 주문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}건</div>
            <p className="text-xs text-green-500 mt-1">+16% 지난 달 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">총 매출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{data.totalSales.toLocaleString()}</div>
            <p className="text-xs text-green-500 mt-1">+8% 지난 달 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">신규 문의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingOrders}건</div>
            <p className="text-xs text-amber-500 mt-1">3개 답변 대기 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">인기 상품</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{data.popularProduct}</div>
            <p className="text-xs text-gray-500 mt-1">총 15개 판매</p>
          </CardContent>
        </Card>
      </div>
      
      {/* 최근 주문 */}
      <h2 className="text-xl font-bold mb-4">최근 주문</h2>
      <Card className="mb-8">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-xs font-medium">
              <tr>
                <th className="px-4 py-3 text-left">주문 번호</th>
                <th className="px-4 py-3 text-left">상품</th>
                <th className="px-4 py-3 text-left">금액</th>
                <th className="px-4 py-3 text-left">주문 일자</th>
                <th className="px-4 py-3 text-left">상태</th>
                <th className="px-4 py-3 text-left">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-3">#{order.id}</td>
                  <td className="px-4 py-3">{order.products?.name}</td>
                  <td className="px-4 py-3">₩{order.total_price.toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === '주문 접수' ? 'bg-blue-100 text-blue-800' :
                      order.status === '입금 확인' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === '배송 준비중' ? 'bg-purple-100 text-purple-800' :
                      order.status === '배송중' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === '배송 완료' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      관리
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="border-t">
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            모든 주문 보기
          </Link>
        </CardFooter>
      </Card>
      
      {/* 최근 문의 */}
      <h2 className="text-xl font-bold mb-4">최근 문의</h2>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-xs font-medium">
              <tr>
                <th className="px-4 py-3 text-left">번호</th>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-left">고객명</th>
                <th className="px-4 py-3 text-left">문의 일자</th>
                <th className="px-4 py-3 text-left">상태</th>
                <th className="px-4 py-3 text-left">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-3">#{inquiry.id}</td>
                  <td className="px-4 py-3">{inquiry.title}</td>
                  <td className="px-4 py-3">{inquiry.customer_name}</td>
                  <td className="px-4 py-3">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inquiry.status === '답변 완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      답변하기
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="border-t">
          <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:underline">
            모든 문의 보기
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 