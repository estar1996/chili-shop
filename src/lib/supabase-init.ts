import { createClient } from '@supabase/supabase-js';

export async function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 환경 변수가 설정되지 않았습니다.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // products 테이블이 있는지 확인
    const { error: productsQueryError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    // 테이블이 없으면 생성
    if (productsQueryError && productsQueryError.code === '42P01') { // 테이블이 존재하지 않음 에러 코드
      console.log('products 테이블 생성 중...');
      
      try {
        // 테이블 생성을 위해 직접 SQL 문을 실행할 수는 없지만,
        // Supabase Studio에서 SQL 스크립트를 실행하도록 안내
        console.log('Supabase Dashboard에서 다음 SQL을 실행해주세요:');
        console.log(`
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price NUMERIC NOT NULL,
            category TEXT,
            weight TEXT,
            stock INTEGER DEFAULT 0,
            details TEXT,
            shipping TEXT,
            origin TEXT,
            storage TEXT,
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
      } catch (sqlError) {
        console.error('products 테이블 생성 안내 출력 중 오류:', sqlError);
      }
    }

    // product-images 버킷이 있는지 확인
    const { data: buckets } = await supabase.storage.listBuckets();
    const productImagesBucket = buckets?.find(bucket => bucket.name === 'product-images');

    // 버킷이 없으면 생성
    if (!productImagesBucket) {
      console.log('product-images 버킷 생성 중...');
      const { error: createBucketError } = await supabase.storage.createBucket('product-images', {
        public: true // 공개 액세스 허용
      });

      if (createBucketError) {
        console.error('product-images 버킷 생성 실패:', createBucketError);
      } else {
        console.log('product-images 버킷 생성 완료');
      }
    }

    console.log('Supabase 초기화 완료');
    return true;
  } catch (error) {
    console.error('Supabase 초기화 중 오류 발생:', error);
    return false;
  }
} 