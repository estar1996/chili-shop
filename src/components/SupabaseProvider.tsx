'use client';

import { useEffect } from 'react';
import { initializeSupabase } from '@/lib/supabase-init';

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 컴포넌트가 마운트될 때 Supabase 초기화
    const init = async () => {
      try {
        await initializeSupabase();
      } catch (error) {
        console.error('Supabase 초기화 중 오류:', error);
      }
    };
    
    init();
  }, []);
  
  // 이 컴포넌트는 자식을 렌더링합니다
  return <>{children}</>;
} 