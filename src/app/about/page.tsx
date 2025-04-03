import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
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
            <Link href="/about" className="text-green-600 font-medium">회사 소개</Link>
            <Link href="/contact" className="hover:text-green-600 font-medium">문의하기</Link>
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
      <main className="flex-grow bg-gray-50">
        {/* 회사 소개 헤더 배너 */}
        <div className="bg-green-600 text-white py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">명품 고춧가루 이야기</h1>
            <p className="text-xl max-w-2xl mx-auto">
              30년 전통의 노하우와 정직한 마음으로 만든 최고 품질의 고춧가루를 소개합니다
            </p>
          </div>
        </div>

        {/* 회사 철학 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <span className="text-6xl block mb-4">🌶️</span>
                  <span className="text-lg">회사 전경 이미지</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">우리의 철학</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  명품 고춧가루는 1990년에 설립된 전통있는 고춧가루 전문 회사입니다. 
                  지난 30년간 우리는 단 하나의 원칙을 지켜왔습니다 - 최고 품질의 고춧가루만을 
                  고객에게 제공하는 것입니다.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  우리는 직접 계약한 농가에서 재배된 최상급 고추만을 사용하며, 
                  고추의 선별부터 건조, 가공, 포장까지 모든 과정을 철저히 관리합니다.
                  모든 과정에서 깨끗함과 정직함을 최우선으로 생각합니다.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center flex-1 min-w-[160px]">
                    <span className="text-3xl mb-2">👨‍🌾</span>
                    <h3 className="font-bold text-gray-800 mb-1">계약 재배</h3>
                    <p className="text-sm text-gray-600">농가와 직접 계약하여 품질 관리</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center flex-1 min-w-[160px]">
                    <span className="text-3xl mb-2">🌡️</span>
                    <h3 className="font-bold text-gray-800 mb-1">전통 건조</h3>
                    <p className="text-sm text-gray-600">전통 방식으로 건조하여 풍미 유지</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center flex-1 min-w-[160px]">
                    <span className="text-3xl mb-2">🧪</span>
                    <h3 className="font-bold text-gray-800 mb-1">품질 검사</h3>
                    <p className="text-sm text-gray-600">엄격한 품질 관리 시스템</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제조 과정 */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">정성을 담은 제조 과정</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                최상의 고춧가루를 만들기 위한 우리의 세심한 과정을 소개합니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="bg-white overflow-hidden">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">🌱</span>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">1. 고추 재배</h3>
                  <p className="text-gray-600 text-sm">
                    깨끗한 환경에서 계약 농가가 재배한 최상급 고추만을 사용합니다. 재배 과정부터 관리하여 품질을 보증합니다.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white overflow-hidden">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">☀️</span>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">2. 건조 과정</h3>
                  <p className="text-gray-600 text-sm">
                    전통 방식으로 햇볕에 자연 건조하거나 최신 설비로 위생적으로 건조하여 고추의 맛과 영양을 보존합니다.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white overflow-hidden">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">🔄</span>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">3. 분쇄 및 가공</h3>
                  <p className="text-gray-600 text-sm">
                    엄선된 건고추만을 위생적인 환경에서 최적의 방법으로 분쇄하여 고춧가루의 색과 맛을 극대화합니다.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white overflow-hidden">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">4. 포장 및 배송</h3>
                  <p className="text-gray-600 text-sm">
                    신선도를 유지하는 특수 포장으로 고객에게 최상의 상태로 배송됩니다. 모든 제품은 추적 시스템으로 관리됩니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">회사 연혁</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                30년 동안 이어온 명품 고춧가루의 역사적 순간들
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative pl-8 pb-12 border-l-2 border-green-600">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-600"></div>
                <div className="mb-2">
                  <span className="inline-block py-1 px-2 bg-green-100 text-green-800 rounded text-sm font-medium">1990년</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">회사 설립</h3>
                <p className="text-gray-600">
                  농촌 출신의 이철수 대표가 고향의 품질 좋은 고추를 알리기 위해 작은 가공 공장을 세우며 시작했습니다.
                </p>
              </div>
              
              <div className="relative pl-8 pb-12 border-l-2 border-green-600">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-600"></div>
                <div className="mb-2">
                  <span className="inline-block py-1 px-2 bg-green-100 text-green-800 rounded text-sm font-medium">2000년</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">현대식 설비 도입</h3>
                <p className="text-gray-600">
                  증가하는 수요에 맞춰 최신 설비를 갖춘 공장을 신축하고 생산 능력을 확대했습니다.
                </p>
              </div>
              
              <div className="relative pl-8 pb-12 border-l-2 border-green-600">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-600"></div>
                <div className="mb-2">
                  <span className="inline-block py-1 px-2 bg-green-100 text-green-800 rounded text-sm font-medium">2010년</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">품질 인증 획득</h3>
                <p className="text-gray-600">
                  HACCP 인증과 유기농 인증을 획득하여 제품의 안전성과 품질을 공식적으로 인정받았습니다.
                </p>
              </div>
              
              <div className="relative pl-8 pb-12 border-l-2 border-green-600">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-600"></div>
                <div className="mb-2">
                  <span className="inline-block py-1 px-2 bg-green-100 text-green-800 rounded text-sm font-medium">2020년</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">온라인 사업 확장</h3>
                <p className="text-gray-600">
                  코로나19 상황에 대응하여 온라인 판매 채널을 강화하고 전국 고객들에게 더 쉽게 제품을 제공하게 되었습니다.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-600"></div>
                <div className="mb-2">
                  <span className="inline-block py-1 px-2 bg-green-100 text-green-800 rounded text-sm font-medium">현재</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">지속적인 품질 향상</h3>
                <p className="text-gray-600">
                  오늘도 명품 고춧가루는 최고의 품질과 서비스를 제공하기 위해 끊임없이 노력하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">명품 고춧가루로 요리의 맛을 높여보세요</h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg">
              30년 전통의 노하우가 담긴 최고 품질의 고춧가루를 지금 바로 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg">
                <Link href="/products">상품 구경하기</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-green-700 px-8 py-6 text-lg">
                <Link href="/contact">문의하기</Link>
              </Button>
            </div>
          </div>
        </section>
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