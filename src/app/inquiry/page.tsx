"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function InquiryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    customer_name: "",
    contact: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("데이터 저장 시도중...");

      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            ...formData,
            status: '답변 대기',
          }
        ])
        .select();

      if (error) {
        console.error("Supabase 오류:", error);
        throw error;
      }

      console.log("저장된 데이터:", data);
      toast.success("문의가 성공적으로 등록되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("문의 등록 중 오류가 발생했습니다:", error);
      toast.error("문의 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>문의하기</CardTitle>
          <CardDescription>
            궁금하신 점이나 요청사항을 남겨주시면 빠르게 답변 드리도록 하겠습니다.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                placeholder="문의 제목을 입력해주세요"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">문의 내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="문의하실 내용을 상세히 적어주세요"
                required
                className="min-h-[150px]"
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">이름</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  placeholder="이름을 입력해주세요"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">연락처</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="연락처를 입력해주세요"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "처리중..." : "문의하기"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 