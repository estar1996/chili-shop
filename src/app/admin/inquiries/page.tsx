"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Inquiry {
  id: number;
  title: string;
  content: string;
  customer_name: string;
  contact: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      console.log("문의 데이터 조회 시도...");
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("문의 조회 오류:", error);
        throw error;
      }

      console.log("조회된 문의:", data);
      setInquiries(data || []);
    } catch (error) {
      console.error("문의 목록 조회 중 오류가 발생했습니다:", error);
      toast.error("문의 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: number, newStatus: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success("문의 상태가 업데이트되었습니다.");
      fetchInquiries();
    } catch (error) {
      console.error("문의 상태 업데이트 중 오류가 발생했습니다:", error);
      toast.error("문의 상태 업데이트에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">문의 데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">문의 관리</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">전체 문의 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {inquiries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">등록된 문의가 없습니다.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600 text-xs font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">번호</th>
                  <th className="px-4 py-3 text-left">제목</th>
                  <th className="px-4 py-3 text-left">고객명</th>
                  <th className="px-4 py-3 text-left">연락처</th>
                  <th className="px-4 py-3 text-left">등록일</th>
                  <th className="px-4 py-3 text-left">상태</th>
                  <th className="px-4 py-3 text-left">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="text-sm hover:bg-gray-50">
                    <td className="px-4 py-3">{inquiry.id}</td>
                    <td className="px-4 py-3">{inquiry.title}</td>
                    <td className="px-4 py-3">{inquiry.customer_name}</td>
                    <td className="px-4 py-3">{inquiry.contact}</td>
                    <td className="px-4 py-3">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.status === '답변 완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => updateInquiryStatus(inquiry.id, inquiry.status === '답변 대기' ? '답변 완료' : '답변 대기')}
                        >
                          {inquiry.status === '답변 대기' ? '답변 완료로 변경' : '답변 대기로 변경'}
                        </Button>
                        <Link href={`/admin/inquiries/${inquiry.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            상세보기
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 