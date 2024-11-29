'use client';
import CategoryManager from '@/components/categories/CategoryManager';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Category Management</h1>
      </div>
      <CategoryManager />
    </div>
  );
} 