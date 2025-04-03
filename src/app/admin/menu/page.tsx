"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@supabase/supabase-js";

export default function AdminMenu() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const fetchProducts = async () => {
    try {
      let query = supabase.from("products").select("*");
      
      if (isFeatured) {
        query = query.eq("is_featured", true);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
        toast.error("상품을 불러오는 중 오류가 발생했습니다.");
        return;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("상품을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isFeatured]);

  const deleteProduct = async (id: number) => {
    if (!confirm("정말 이 상품을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      
      if (error) {
        console.error("Error deleting product:", error);
        toast.error("상품 삭제 중 오류가 발생했습니다.");
        return;
      }
      
      toast.success("상품이 삭제되었습니다.");
      fetchProducts();
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      toast.error("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            label="인기상품만 보기"
            checked={isFeatured}
            onChange={(e) => {
              setIsFeatured(e.target.checked);
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>상품을 불러오는 중...</p>
        ) : products.length === 0 ? (
          <p>상품이 없습니다.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="mb-2">{product.price.toLocaleString()}원</p>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              
              <div className="flex justify-between">
                <a
                  href={`/admin/menu/edit/${product.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  수정
                </a>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6">
        <a
          href="/admin/menu/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          새 상품 추가
        </a>
      </div>
    </div>
  );
} 