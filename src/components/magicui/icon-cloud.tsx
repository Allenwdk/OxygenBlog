'use client';

/**
 * IconCloud 组件占位实现
 * 原组件应为 3D 球体图标云动画
 * 此处保持接口一致，使构建能够通过
 */
export function IconCloud({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden"
        >
          <img
            src={src}
            alt=""
            className="w-6 h-6 object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
