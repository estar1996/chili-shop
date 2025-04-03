"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderCompletePage() {
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

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 mb-8">
              주문해 주셔서 감사합니다. 입금 확인 후 배송이 시작됩니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-bold mb-4">입금 안내</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">은행명</span>
                <span className="font-medium">농협</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">계좌번호</span>
                <span className="font-medium">123-4567-8910-11</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">예금주</span>
                <span className="font-medium">홍길동</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                ※ 주문자명과 입금자명이 다른 경우 고객센터로 연락 바랍니다.
              </p>
            </div>
          </div>

          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/products">다른 상품 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 