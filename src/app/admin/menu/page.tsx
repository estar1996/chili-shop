"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

interface Product {
  id: number
  name: string
  price: number
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )
        
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  if (loading) {
    return <div>로딩 중...</div>
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">상품 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <h2 className="font-bold">{product.name}</h2>
            <p className="text-gray-600">{product.price}원</p>
          </div>
        ))}
      </div>
    </div>
  )
} 