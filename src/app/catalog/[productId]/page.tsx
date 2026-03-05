import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { Tables } from '@/types/database'

interface PageProps {
  params: { productId: string }
}

type ProductRow = Tables<'products'>
type VariantRow = Pick<Tables<'product_variants'>, 'color_name' | 'color_hex' | 'size' | 'is_available'>
type PriceRow = Pick<Tables<'shirt_pricing'>, 'price_per_unit_thb'>

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('name').eq('id', params.productId).single()
  const product = data as Pick<ProductRow, 'name'> | null
  return {
    title: product ? `${product.name} | PimSuea` : 'สินค้า | PimSuea',
  }
}

export default async function CatalogDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const [
    { data: productRaw },
    { data: variantsRaw },
    { data: priceRaw },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('id', params.productId)
      .eq('is_active', true)
      .single(),
    supabase
      .from('product_variants')
      .select('color_name, color_hex, size, is_available')
      .eq('product_id', params.productId)
      .order('color_name')
      .order('size'),
    supabase
      .from('shirt_pricing')
      .select('price_per_unit_thb')
      .eq('product_id', params.productId)
      .eq('color_name', 'White')
      .eq('size', 'S')
      .eq('min_qty', 1)
      .single(),
  ])

  const product = productRaw as ProductRow | null
  if (!product) notFound()

  const variants = (variantsRaw ?? []) as VariantRow[]
  const priceRow = priceRaw as PriceRow | null

  // Deduplicate colors for swatches using Array.from instead of spread (ES target compat)
  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.color_name, { color_name: v.color_name, color_hex: v.color_hex }])).values()
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="text-brand-green text-sm font-bold mb-6 inline-block hover:underline"
      >
        ← กลับสู่สินค้าทั้งหมด
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Left: catalog showcase image */}
        <div className="relative aspect-square bg-surface-gray">
          {product.catalog_image_url ? (
            <Image
              src={product.catalog_image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-gray text-sm">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        {/* Right: product info */}
        <div>
          <h1 className="text-3xl font-heavy text-brand-green mb-2">{product.name}</h1>

          {priceRow && (
            <p className="text-2xl font-bold text-brand-orange mb-4">
              เริ่มต้น ฿{priceRow.price_per_unit_thb}
            </p>
          )}

          <div className="flex gap-2 mb-6">
            {product.supported_printing_types.map((type) => (
              <Badge key={type} variant={type === 'DTG' ? 'dtg' : 'dtf'}>
                {type}
              </Badge>
            ))}
          </div>

          {product.description && (
            <p className="text-deep-black mb-6 leading-relaxed">{product.description}</p>
          )}

          {/* Color swatches */}
          {uniqueColors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-deep-black mb-2">สีที่มี</p>
              <div className="flex gap-4">
                {uniqueColors.map((color) => (
                  <div key={color.color_name} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-surface-gray shadow-sm"
                      style={{ backgroundColor: color.color_hex }}
                      title={color.color_name}
                    />
                    <span className="text-xs text-slate-gray">{color.color_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.care_instructions && (
            <div className="mb-6">
              <p className="text-sm font-bold text-deep-black mb-1">การดูแลรักษา</p>
              <p className="text-sm text-slate-gray leading-relaxed">{product.care_instructions}</p>
            </div>
          )}

          {product.size_guide_url && (
            <div className="mb-8">
              <p className="text-sm font-bold text-deep-black mb-2">ตารางไซส์</p>
              <Image
                src={product.size_guide_url}
                alt="ตารางไซส์"
                width={480}
                height={280}
                className="w-full max-w-sm"
              />
            </div>
          )}

          <Link
            href={`/design/${product.id}`}
            className="inline-block bg-brand-orange text-white font-bold px-8 py-3 rounded-btn hover:opacity-90 transition-opacity"
          >
            เริ่มออกแบบ →
          </Link>
        </div>
      </div>
    </main>
  )
}
