"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "product",
    message: "",
    agreeToPrivacyPolicy: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToPrivacyPolicy: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToPrivacyPolicy) {
      toast({
        title: "개인정보 수집에 동의해주세요",
        description: "문의를 보내시려면 개인정보 수집에 동의하셔야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Supabase 클라이언트 초기화
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      
      // inquiries 테이블에 문의 데이터 저장
      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            inquiry_type: formData.inquiryType,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "문의가 성공적으로 전송되었습니다",
        description: "빠른 시일 내에 답변 드리겠습니다.",
      });
    } catch (error) {
      console.error("문의 전송 중 오류가 발생했습니다:", error);
      toast({
        title: "문의 전송 실패",
        description: "문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="bg-white text-gray-800 py-4 border-b">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link href="/" className="text-2xl font-bold text-green-600">
            <div className="flex items-center">
              <span className="text-3xl">🌶️</span>
              <span className="ml-2">명품 고춧가루</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-green-600 font-medium">홈</Link>
            <Link href="/products" className="hover:text-green-600 font-medium">상품</Link>
            <Link href="/about" className="hover:text-green-600 font-medium">회사 소개</Link>
            <Link href="/contact" className="text-green-600 font-medium">문의하기</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/order" className="hover:text-green-600">
              <span className="text-2xl">🛒</span>
            </Link>
            <button className="md:hidden">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* 페이지 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">문의하기</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              제품에 대한 문의나 궁금한 점이 있으시면 언제든지 연락주세요.
              빠른 시일 내에 정성껏 답변 드리겠습니다.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 문의 폼 */}
              <div className="md:col-span-2">
                <Card className="p-6 bg-white">
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-green-600 text-2xl">✓</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">문의가 접수되었습니다</h2>
                      <p className="text-gray-600 mb-6">
                        보내주신 문의는 확인 후 빠른 시일 내에 답변 드리겠습니다.
                      </p>
                      <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/">홈으로 돌아가기</Link>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h2 className="text-xl font-bold mb-4">문의 양식</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="이름을 입력하세요"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="이메일 주소를 입력하세요"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">연락처</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="연락처를 입력하세요 (선택사항)"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">문의 제목 <span className="text-red-500">*</span></Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="문의 제목을 입력하세요"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>문의 유형 <span className="text-red-500">*</span></Label>
                          <RadioGroup 
                            value={formData.inquiryType} 
                            onValueChange={handleRadioChange}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="product" id="product" />
                              <Label htmlFor="product" className="cursor-pointer">제품 문의</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="order" id="order" />
                              <Label htmlFor="order" className="cursor-pointer">주문 관련</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="shipping" id="shipping" />
                              <Label htmlFor="shipping" className="cursor-pointer">배송 문의</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="cursor-pointer">기타</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">문의 내용 <span className="text-red-500">*</span></Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="문의 내용을 자세히 적어주세요"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="min-h-[150px]"
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2 mt-4">
                          <Checkbox 
                            id="privacy" 
                            checked={formData.agreeToPrivacyPolicy}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                          />
                          <Label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                            개인정보 수집 및 이용에 동의합니다. 수집된 정보는 문의 답변을 위해서만 사용됩니다. <span className="text-red-500">*</span>
                          </Label>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700 py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "전송 중..." : "문의 보내기"}
                      </Button>
                    </form>
                  )}
                </Card>
              </div>
              
              {/* 연락처 정보 */}
              <div>
                <Card className="p-6 bg-white mb-6">
                  <h3 className="text-lg font-bold mb-4">직접 연락하기</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">전화번호</p>
                      <p className="font-medium">010-1234-5678</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">이메일</p>
                      <p className="font-medium">info@chillshop.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">영업 시간</p>
                      <p className="font-medium">평일 09:00 - 18:00</p>
                      <p className="text-sm text-gray-500">(점심시간: 12:00 - 13:00)</p>
                      <p className="text-sm text-gray-500">주말 및 공휴일 휴무</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-white">
                  <h3 className="text-lg font-bold mb-4">자주 묻는 질문</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="#" className="text-green-600 hover:underline">
                        배송은 얼마나 걸리나요?
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-green-600 hover:underline">
                        고춧가루 보관 방법이 궁금합니다.
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-green-600 hover:underline">
                        유통기한은 어떻게 되나요?
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-green-600 hover:underline">
                        도매 구매는 가능한가요?
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-green-600 hover:underline">
                        모든 FAQ 보기
                      </Link>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">명품 고춧가루</h3>
              <p className="text-gray-400">최고 품질의 국내산 고춧가루</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <p className="text-gray-400">전화: 010-1234-5678</p>
              <p className="text-gray-400">이메일: info@chillshop.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white">상품</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">회사 소개</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">문의하기</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>&copy; 2024 명품 고춧가루. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 