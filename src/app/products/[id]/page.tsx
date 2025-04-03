"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// 임시 상품 데이터
const products = [
  {
    id: 1,
    name: "프리미엄 고운 고춧가루",
    description: "요리의 색과 맛을 선명하게 살려주는 고운 고춧가루",
    price: 25000,
    image: "/product1.jpg", // 이미지 없는 경우 기본 이미지 사용
    weight: "500g",
    category: "고운 고춧가루",
    details: "엄선된 국내산 햇 고추를 건조한 후 정성껏 가공하여 만든 고급 고춧가루입니다. 선명한 붉은 색과 고유의 향이 그대로 살아있어 요리의 색과 맛을 한층 더 살려줍니다. 양념이나 고추장 등 색이 중요한 요리에 적합합니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [2, 3, 5],
    reviews: [
      { id: 1, user: "김**", rating: 5, content: "색과 맛이 아주 좋아요. 요리할 때 쓰니 확실히 차이가 납니다.", date: "2024-02-15" },
      { id: 2, user: "이**", rating: 4, content: "포장이 깔끔하고 신선해요. 다음에도 구매할 예정입니다.", date: "2024-02-10" }
    ]
  },
  {
    id: 2,
    name: "특상품 굵은 고춧가루",
    description: "김치와 찌개에 잘 어울리는 굵은 입자의 고춧가루",
    price: 28000,
    image: "/product2.jpg",
    weight: "500g",
    category: "굵은 고춧가루",
    details: "김치와 찌개요리에 적합한 굵은 입자의 고춧가루입니다. 씨를 포함하여 갈았기 때문에 깊은 맛과 알싸한 매운맛이 특징입니다. 전통적인 맛을 내는 김치나 찌개 요리에 이상적입니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [1, 4, 8],
    reviews: [
      { id: 1, user: "박**", rating: 5, content: "김치 담그는데 써봤는데 정말 맛있게 됐어요!", date: "2024-03-01" }
    ]
  },
  {
    id: 3,
    name: "유기농 고춧가루 세트",
    description: "무농약 인증 고춧가루 세트 (고운/굵은 각 250g)",
    price: 35000,
    image: "/product3.jpg",
    weight: "500g",
    category: "세트 상품",
    details: "유기농 인증을 받은 고추로 만든 프리미엄 고춧가루 세트입니다. 고운 고춧가루와 굵은 고춧가루 각 250g으로 구성되어 용도에 맞게 사용하실 수 있습니다. 화학비료와 농약을 사용하지 않고 재배하여 안심하고 드실 수 있습니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100% (친환경 인증)",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [1, 2, 7],
    reviews: []
  },
  {
    id: 4,
    name: "매운맛 고춧가루",
    description: "화끈한 매운맛을 원하는 분들을 위한 매운 고춧가루",
    price: 27000,
    image: "/product4.jpg",
    weight: "500g",
    category: "매운 고춧가루",
    details: "청양고추를 포함하여 만든 매운 고춧가루입니다. 일반 고춧가루보다 매운맛이 강하여 매운 요리를 좋아하시는 분들께 적합합니다. 특히 매운 찌개나 양념에 사용하면 풍미가 더욱 살아납니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [2, 8],
    reviews: [
      { id: 1, user: "최**", rating: 5, content: "정말 맵습니다! 매운 음식 좋아하시는 분들께 추천해요.", date: "2024-01-25" },
      { id: 2, user: "정**", rating: 4, content: "매운맛이 확실하네요. 소량만 넣어도 확실한 매운맛이 납니다.", date: "2024-01-18" }
    ]
  },
  {
    id: 5,
    name: "순한맛 고춧가루",
    description: "아이들도 잘 먹을 수 있는 순한 맛 고춧가루",
    price: 26000,
    image: "/product5.jpg",
    weight: "500g",
    category: "순한 고춧가루",
    details: "매운맛이 적은 품종의 고추로 만들어 아이들도 부담 없이 먹을 수 있는 순한 고춧가루입니다. 고추의 맛과 향은 살아있으면서도 매운맛이 적어 온 가족이 함께 즐길 수 있습니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [1, 3],
    reviews: [
      { id: 1, user: "김**", rating: 5, content: "아이들도 잘 먹어요. 매운맛 없이 고춧가루 특유의 맛이 살아있어요.", date: "2024-02-05" }
    ]
  },
  {
    id: 6,
    name: "대용량 고춧가루",
    description: "김장용으로 적합한 대용량 고춧가루",
    price: 45000,
    image: "/product6.jpg",
    weight: "1kg",
    category: "대용량",
    details: "김장이나 대량 조리에 적합한 대용량 고춧가루입니다. 적당한 굵기와 매운맛으로 다양한 요리에 두루 사용할 수 있습니다. 경제적인 가격으로 많은 양을 사용하시는 분들께 적합합니다.",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요.",
    related: [2, 8],
    reviews: [
      { id: 1, user: "이**", rating: 5, content: "김장할 때 썼는데 양도 많고 품질도 좋아요.", date: "2023-11-10" },
      { id: 2, user: "박**", rating: 4, content: "가성비가 좋습니다. 식당 운영하시는 분들께 추천해요.", date: "2023-12-05" }
    ]
  }
];

// 상품 ID로 상품 정보 찾기
function getProductById(id: string) {
  const productId = parseInt(id, 10);
  return products.find(product => product.id === productId);
}

// 관련 상품 가져오기
function getRelatedProducts(relatedIds: number[]) {
  return products.filter(product => relatedIds.includes(product.id));
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('상품 정보 조회 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    router.push(`/order?productId=${product.id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
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

      {/* 상품 상세 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 상품 이미지 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 text-6xl">
                🌶️
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-red-600 mb-4">
                {product.price?.toLocaleString()}원
              </p>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4 py-4 border-t border-b">
              <div>
                <p className="font-medium mb-1">중량</p>
                <p className="text-gray-600">{product.weight}</p>
              </div>
              <div>
                <p className="font-medium mb-1">원산지</p>
                <p className="text-gray-600">{product.origin}</p>
              </div>
              <div>
                <p className="font-medium mb-1">배송 정보</p>
                <p className="text-gray-600">{product.shipping}</p>
              </div>
              <div>
                <p className="font-medium mb-1">보관 방법</p>
                <p className="text-gray-600">{product.storage}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">수량:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleBuyNow}
                >
                  바로 구매하기
                </Button>
              </div>
            </div>

            {product.details && (
              <div className="pt-8">
                <h2 className="text-xl font-bold mb-4">상품 상세 정보</h2>
                <p className="text-gray-600 whitespace-pre-line">{product.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">명품 고춧가루</h3>
              <p className="text-gray-400">최고 품질의 국내산 고춧가루</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">연락처</h3>
              <p className="text-gray-400">전화: 010-1234-5678</p>
              <p className="text-gray-400">이메일: info@chilishop.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">빠른 링크</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white">상품</Link></li>
                <li><Link href="/company" className="text-gray-400 hover:text-white">회사 소개</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">문의하기</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 명품 고춧가루. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
} 