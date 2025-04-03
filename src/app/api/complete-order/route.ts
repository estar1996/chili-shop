import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // 요청 본문에서 데이터 추출
    const orderData = await request.json();

    // 유효성 검사
    if (!orderData.customerName || !orderData.phoneNumber || !orderData.address || !orderData.items) {
      return NextResponse.json(
        { success: false, error: '주문 정보가 부족합니다.' },
        { status: 400 }
      );
    }

    // 주문 번호 생성
    const orderNumber = generateOrderNumber();

    // Supabase에 주문 데이터 저장
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        phone_number: orderData.phoneNumber,
        email: orderData.email || null,
        address: orderData.address,
        address_detail: orderData.addressDetail || null,
        zipcode: orderData.zipcode || null,
        items: orderData.items,
        total_price: calculateTotalPrice(orderData.items),
        shipping_fee: 3000, // 기본 배송비
        status: 'pending_payment', // 초기 상태: 결제 대기 중
        special_instructions: orderData.specialInstructions || null,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('주문 저장 중 오류 발생:', error);
      return NextResponse.json(
        { success: false, error: '주문 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // SMS 발송 요청
    const smsResponse = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: orderData.phoneNumber,
        message: `[명품 고춧가루] ${orderData.customerName}님, 주문이 완료되었습니다. 주문번호: ${orderNumber}. 계좌이체 확인 후 배송이 시작됩니다.`
      })
    });

    const smsResult = await smsResponse.json();

    // 주문 결과 반환
    return NextResponse.json({
      success: true,
      order: {
        id: data[0].id,
        orderNumber: orderNumber,
        status: 'pending_payment',
        createdAt: data[0].created_at
      },
      sms: smsResult.success ? 'sent' : 'failed'
    });
    
  } catch (error) {
    console.error('주문 처리 중 오류 발생:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { success: false, error: '주문 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 주문 번호 생성 함수
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2); // 연도 뒤 2자리
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  // 랜덤 숫자 6자리
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
}

// 총 주문 금액 계산 함수
function calculateTotalPrice(items: any[]): number {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
} 