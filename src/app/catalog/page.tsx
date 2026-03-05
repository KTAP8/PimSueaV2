import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { Tables } from '@/types/database'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata = {
  title: 'สินค้าทั้งหมด | PimSuea',
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const rawType = searchParams.type
  const typeFilter = rawType === 'DTG' || rawType === 'DTF' ? rawType : null

  // Ternary avoids `let query` reassignment which collapses type to never
  const { data: productsRaw } = typeFilter
    ? await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .contains('supported_printing_types', [typeFilter])
    : await supabase.from('products').select('*').eq('is_active', true)

  const products = (productsRaw ?? []) as Tables<'products'>[]
  const productIds = products.map((p) => p.id)

  type TemplateRow = Pick<Tables<'product_templates'>, 'product_id' | 'mockup_image_url'>
  type PriceRow = Pick<Tables<'shirt_pricing'>, 'product_id' | 'price_per_unit_thb'>

  // Fetch front templates and starting prices in parallel
  const [{ data: templatesRaw }, { data: pricesRaw }] = await Promise.all([
    supabase
      .from('product_templates')
      .select('product_id, mockup_image_url')
      .eq('face', 'front')
      .in('product_id', productIds),
    supabase
      .from('shirt_pricing')
      .select('product_id, price_per_unit_thb')
      .eq('color_name', 'White')
      .eq('size', 'S')
      .eq('min_qty', 1)
      .in('product_id', productIds),
  ])

  const mockupByProductId = Object.fromEntries(
    ((templatesRaw ?? []) as TemplateRow[]).map((t) => [t.product_id, t.mockup_image_url])
  )
  const priceByProductId = Object.fromEntries(
    ((pricesRaw ?? []) as PriceRow[]).map((p) => [p.product_id, p.price_per_unit_thb])
  )

  const filterLinkClass = (active: boolean) =>
    `px-4 py-2 rounded-btn text-sm font-bold transition-colors ${
      active
        ? 'bg-brand-green text-white'
        : 'border border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
    }`

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-green mb-6">สินค้าทั้งหมด</h1>

      {/* Filter bar */}
      <div className="flex gap-2 mb-8">
        <Link href="/catalog" className={filterLinkClass(!typeFilter)}>
          ทั้งหมด
        </Link>
        <Link href="/catalog?type=DTG" className={filterLinkClass(typeFilter === 'DTG')}>
          DTG
        </Link>
        <Link href="/catalog?type=DTF" className={filterLinkClass(typeFilter === 'DTF')}>
          DTF
        </Link>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <p className="text-slate-gray">ไม่พบสินค้า</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const mockupUrl = mockupByProductId[product.id]
            const startingPrice = priceByProductId[product.id]

            return (
              <Link
                key={product.id}
                href={`/catalog/${product.id}`}
                className="bg-crisp-white rounded-card border border-surface-gray overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative bg-surface-gray">
                  {mockupUrl ? (
                    <Image
                      src={mockupUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-gray text-sm">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-deep-black mb-1">{product.name}</h2>
                  {startingPrice !== undefined && (
                    <p className="text-brand-orange font-bold mb-2">เริ่มต้น ฿{startingPrice}</p>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {product.supported_printing_types.map((type) => (
                      <Badge key={type} variant={type === 'DTG' ? 'dtg' : 'dtf'}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
