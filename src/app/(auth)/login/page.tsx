'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

type FormData = z.infer<typeof loginSchema>
type FieldErrors = Partial<Record<keyof FormData, string>>

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({ email: '', password: '' })
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

    const result = loginSchema.safeParse(form)
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

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setServerError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      setLoading(false)
      return
    }

    router.push('/catalog')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md bg-white rounded-[8px] shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#08636D] mb-1">เข้าสู่ระบบ</h1>
        <p className="text-sm text-[#6C757D] mb-6">ยินดีต้อนรับกลับมา</p>

        {serverError && (
          <div className="mb-4 p-3 rounded-[4px] border border-[#C23B32] bg-red-50 text-[#C23B32] text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              placeholder="รหัสผ่านของคุณ"
              className={inputClass(!!errors.password)}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#F05A25] text-white font-medium rounded-[4px] hover:bg-[#d94e1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#6C757D]">
          ยังไม่มีบัญชี?{' '}
          <Link href="/signup" className="text-[#08636D] font-medium hover:underline">
            สมัครสมาชิก
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
