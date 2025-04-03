import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio 클라이언트 초기화
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    // 요청 본문에서 데이터 추출
    const { phoneNumber, message } = await request.json();

    // 유효성 검사
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: '전화번호와 메시지는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    // 한국 전화번호 형식 확인 및 포맷 조정
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // SMS 전송
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber
    });

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: result.status
    });
    
  } catch (error) {
    console.error('SMS 전송 중 오류 발생:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { success: false, error: '메시지 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 전화번호 형식 조정 함수
function formatPhoneNumber(phoneNumber: string): string {
  // 숫자만 추출
  const digits = phoneNumber.replace(/\D/g, '');
  
  // 한국 전화번호인 경우 국제 형식으로 변환
  if (digits.startsWith('0')) {
    return '+82' + digits.substring(1);
  }
  
  // 이미 국제 형식인 경우 그대로 반환
  if (digits.startsWith('82')) {
    return '+' + digits;
  }
  
  // 기타 형식은 그대로 사용
  return phoneNumber;
} 