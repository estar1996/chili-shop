"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  response?: string;
}

export default function InquiryDetail() {
  const params = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiryDetail();
  }, []);

  const fetchInquiryDetail = async () => {
    try {
      setLoading(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setInquiry(data);
      setResponse(data.response || "");
    } catch (error) {
      console.error("문의 상세 정보 조회 중 오류가 발생했습니다:", error);
      toast.error("문의 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    try {
      setSubmitting(true);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error } = await supabase
        .from('inquiries')
        .update({ 
          response: response,
          status: '답변 완료',
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);

      if (error) throw error;

      toast.success("답변이 저장되었습니다.");
      fetchInquiryDetail();
    } catch (error) {
      console.error("답변 저장 중 오류가 발생했습니다:", error);
      toast.error("답변 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">문의 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">문의 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">문의 상세</h1>
        <Button variant="outline" onClick={() => router.push('/admin/inquiries')}>
          목록으로 돌아가기
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>문의 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">제목</h3>
              <p className="mt-1">{inquiry.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">고객 정보</h3>
              <p className="mt-1">
                {inquiry.customer_name} ({inquiry.email}, {inquiry.contact})
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">등록일</h3>
              <p className="mt-1">{new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">상태</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  inquiry.status === '답변 완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {inquiry.status}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">문의 내용</h3>
              <p className="mt-1 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">{inquiry.content}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>답변 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="고객 문의에 대한 답변을 작성해주세요."
              className="min-h-[200px]"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={submitting} onClick={handleSaveResponse}>
              {submitting ? "저장 중..." : "답변 저장하기"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 