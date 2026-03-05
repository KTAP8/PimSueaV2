'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'


const signUpSchema = z.object({
  full_name: z.string().min(1, 'กรุณากรอกชื่อ-นามสกุล'),
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  phone: z
    .string()
    .regex(/^0[0-9]{9}$/, 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก เริ่มต้นด้วย 0'),
})

type FormData = z.infer<typeof signUpSchema>
type FieldErrors = Partial<Record<keyof FormData, string>>

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    const result = signUpSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
      } as any)
    }

    router.push('/catalog')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md bg-white rounded-[8px] shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#08636D] mb-1">สมัครสมาชิก</h1>
        <p className="text-sm text-[#6C757D] mb-6">
          สร้างบัญชีเพื่อเริ่มออกแบบเสื้อของคุณ
        </p>

        {serverError && (
          <div className="mb-4 p-3 rounded-[4px] border border-[#C23B32] bg-red-50 text-[#C23B32] text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="ชื่อ-นามสกุล" error={errors.full_name}>
            <input
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="ชื่อ นามสกุล"
              className={inputClass(!!errors.full_name)}
            />
          </Field>

          <Field label="อีเมล" error={errors.email}>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={inputClass(!!errors.email)}
            />
          </Field>

          <Field label="รหัสผ่าน" error={errors.password}>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className={inputClass(!!errors.password)}
            />
          </Field>

          <Field label="เบอร์โทรศัพท์" error={errors.phone}>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="0812345678"
              className={inputClass(!!errors.phone)}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#F05A25] text-white font-medium rounded-[4px] hover:bg-[#d94e1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#6C757D]">
          มีบัญชีแล้ว?{' '}
          <Link href="/login" className="text-[#08636D] font-medium hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121212] mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[#C23B32]">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full px-3 py-2 rounded-[4px] border text-sm text-[#121212] bg-[#E9ECEF]',
    'outline-none transition-all placeholder:text-[#6C757D]',
    hasError
      ? 'border-[#C23B32] focus:ring-1 focus:ring-[#C23B32]'
      : 'border-[#E9ECEF] focus:border-[#F05A25] focus:ring-1 focus:ring-[#F05A25]',
  ].join(' ')
}
