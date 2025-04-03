"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/admin">관리자 대시보드</Link>
          </h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              메인 사이트 보기
            </Link>
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
              관리자
            </span>
          </div>
        </div>
      </header>

      {/* 사이드바 및 메인 콘텐츠 */}
      <div className="flex-grow flex">
        {/* 사이드바 */}
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">관리자 메뉴</h2>
              <nav className="space-y-2">
                <Link 
                  href="/admin" 
                  className={`flex items-center py-2 px-3 rounded-md ${
                    pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  대시보드
                </Link>
                <Link 
                  href="/admin/products" 
                  className={`flex items-center py-2 px-3 rounded-md ${
                    pathname === "/admin/products" ? "bg-gray-700" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  상품 관리
                </Link>
                <Link 
                  href="/admin/orders" 
                  className={`flex items-center py-2 px-3 rounded-md ${
                    pathname === "/admin/orders" ? "bg-gray-700" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  주문 관리
                </Link>
                <Link 
                  href="/admin/inquiries" 
                  className={`flex items-center py-2 px-3 rounded-md ${
                    pathname === "/admin/inquiries" ? "bg-gray-700" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  문의 관리
                </Link>
                <Link 
                  href="/admin/settings" 
                  className={`flex items-center py-2 px-3 rounded-md ${
                    pathname === "/admin/settings" ? "bg-gray-700" : "hover:bg-gray-700"
                  } transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  설정
                </Link>
              </nav>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <Link href="/" className="flex items-center py-2 px-3 rounded-md hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                메인 사이트로 돌아가기
              </Link>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-grow p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 