// src/components/ui/ProductImage.tsx
import { OptimizedImage } from "./OptimizedImage"

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  containerClassName?: string
  fill?: boolean
  priority?: boolean
}

export function ProductImage({
  src,
  alt,
  className,
  containerClassName,
  fill = false,
  priority = false,
}: ProductImageProps) {
  const imageSrc = src || "/images/product-placeholder.jpg"

  if (fill) {
    return (
      <OptimizedImage
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        containerClassName={containerClassName}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    )
  }

  return (
    <OptimizedImage
      src={imageSrc}
      alt={alt}
      width={400}
      height={400}
      className={className}
      containerClassName={containerClassName}
      priority={priority}
    />
  )
}
