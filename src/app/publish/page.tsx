'use client';

import PublishForm from '@/components/publish/PublishForm';

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">发布新文章</h1>
          <PublishForm />
        </div>
      </div>
    </div>
  );
}