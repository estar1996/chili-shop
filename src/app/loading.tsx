"use client";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      <p className="ml-2 text-lg text-gray-700">로딩 중...</p>
    </div>
  );
} 