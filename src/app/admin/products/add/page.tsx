"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    weight: "",
    stock: "",
    details: "",
    shipping: "택배 배송 (배송비 3,000원, 5만원 이상 구매 시 무료)",
    origin: "국내산 100%",
    storage: "직사광선을 피하고 서늘하고 건조한 곳에 보관하세요."
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('상품 등록 시작...');
      
      // 유효성 검사
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('필수 항목(상품명, 가격, 카테고리)을 모두 입력해주세요.');
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      // 숫자 필드 변환
      const numericPrice = parseFloat(formData.price);
      const numericStock = parseInt(formData.stock);

      if (isNaN(numericPrice)) {
        throw new Error('가격은 숫자로 입력해주세요.');
      }

      // 상품 정보 객체 생성
      const productData = {
        name: formData.name,
        description: formData.description,
        price: numericPrice,
        category: formData.category,
        weight: formData.weight,
        stock: isNaN(numericStock) ? 0 : numericStock,
        details: formData.details,
        shipping: formData.shipping,
        origin: formData.origin,
        storage: formData.storage,
        created_at: new Date().toISOString(),
      };

      console.log('상품 데이터:', productData);

      // 먼저 상품 정보 저장
      const { data: productInsertData, error: productInsertError } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (productInsertError) {
        console.error('상품 정보 저장 오류:', productInsertError);
        throw new Error(`상품 정보 저장 실패: ${productInsertError.message}`);
      }

      console.log('상품 정보 저장 성공:', productInsertData);
      
      if (!productInsertData || productInsertData.length === 0) {
        throw new Error('상품 정보가 정상적으로 저장되지 않았습니다.');
      }

      const newProductId = productInsertData[0].id;

      // 이미지가 있으면 Storage에 업로드하고 URL 업데이트
      if (imageFile) {
        console.log('이미지 업로드 시작...');
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${newProductId}-${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // 이미지 Storage에 업로드
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error('이미지 업로드 오류:', uploadError);
          throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
        }

        console.log('이미지 업로드 성공');

        // 이미지 URL 가져오기
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        console.log('이미지 URL:', urlData);

        // 상품 정보에 이미지 URL 업데이트
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: urlData.publicUrl })
          .eq('id', newProductId);

        if (updateError) {
          console.error('이미지 URL 업데이트 오류:', updateError);
          throw new Error(`이미지 URL 업데이트 실패: ${updateError.message}`);
        }
        
        console.log('이미지 URL 업데이트 성공');
      }

      toast({
        title: "상품 등록 완료",
        description: "새 상품이 성공적으로 등록되었습니다.",
      });
      
      router.push('/admin/products');
    } catch (error: any) {
      console.error('상품 등록 중 오류가 발생했습니다:', error);
      toast({
        title: "상품 등록 실패",
        description: error.message || "상품을 등록하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">상품 추가</h2>
        <Button variant="outline" onClick={() => router.push('/admin/products')}>
          상품 목록으로 돌아가기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 상품 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">상품명 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="상품명을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">가격 (원) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="가격을 입력하세요 (숫자만)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="고운 고춧가루">고운 고춧가루</SelectItem>
                      <SelectItem value="굵은 고춧가루">굵은 고춧가루</SelectItem>
                      <SelectItem value="유기농">유기농</SelectItem>
                      <SelectItem value="세트 상품">세트 상품</SelectItem>
                      <SelectItem value="매운 고춧가루">매운 고춧가루</SelectItem>
                      <SelectItem value="순한 고춧가루">순한 고춧가루</SelectItem>
                      <SelectItem value="대용량">대용량</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">중량 <span className="text-red-500">*</span></Label>
                  <Input
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="예: 500g, 1kg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">재고 수량</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="재고 수량을 입력하세요 (숫자만)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">상품 이미지</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                    {imagePreview && (
                      <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                        <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">간단 설명 <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="상품에 대한 간단한 설명을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">상세 설명</Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="상품의 상세 설명을 입력하세요"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">원산지</Label>
                  <Input
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="원산지 정보를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping">배송 정보</Label>
                  <Input
                    id="shipping"
                    name="shipping"
                    value={formData.shipping}
                    onChange={handleChange}
                    placeholder="배송 정보를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">보관 방법</Label>
                  <Input
                    id="storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    placeholder="보관 방법을 입력하세요"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 min-w-[150px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "상품 등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 