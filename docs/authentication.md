# Authentication

Dokumentasi sistem autentikasi EcoVision AI yang berbasis JWT + MySQL dengan HTTP-only cookie.

---

## Gambaran Umum

EcoVision AI mengimplementasikan autentikasi custom (tanpa library seperti NextAuth) menggunakan:
- **Password hashing**: `bcryptjs` dengan salt rounds 10
- **Session token**: JSON Web Token (JWT) yang di-sign dengan `JWT_SECRET` atau fallback key
- **Penyimpanan token**: HTTP-only cookie `session_token` (tidak dapat diakses JavaScript)
- **Persistensi**: Tabel `users` di MySQL

---

## Alur Registrasi (`POST /api/auth/register`)

```
1. Terima { name, email, password }
2. Cek apakah email sudah terdaftar
3. Hash password dengan bcrypt (rounds=10)
4. Generate UUID untuk user_id
5. INSERT ke tabel users
6. Return { success: true }
```

**Validasi:**
- Email harus unik
- Password minimal 6 karakter (validasi di client-side)

---

## Alur Login (`POST /api/auth/login`)

```
1. Terima { email, password }
2. Ambil user dari database berdasarkan email
3. Bandingkan password dengan hash (bcrypt.compare)
4. Jika cocok: sign JWT token { userId, email }
5. Set HTTP-only cookie "session_token" (7 hari)
6. Return { success: true, user: { id, name, email } }
```

---

## Verifikasi Session

Setiap API route yang memerlukan autentikasi melakukan:

```typescript
const cookieStore = await cookies();
const token = cookieStore.get("session_token")?.value;
const user = await getUserByToken(token);
if (!user) return 401;
```

`getUserByToken()` di `src/lib/db.ts` melakukan:
1. Verifikasi JWT signature
2. Ekstrak `userId` dari payload
3. Query database untuk data user terkini

---

## Logout (`POST /api/auth/logout`)

Menghapus cookie `session_token` dari response. Token tidak di-blacklist di server (stateless).

---

## Halaman

| Route | Deskripsi |
|---|---|
| `/login` | Form login dengan email & password |
| `/register` | Form registrasi akun baru |
| `/dashboard` | Halaman yang memerlukan user terautentikasi |

**Redirect Logic:**
- Halaman `/dashboard` mengecek autentikasi via hook `useAuth`. Jika tidak login, redirect ke `/login`.
- Navbar menampilkan link Dashboard + tombol Logout jika `isAuthenticated === true`.

---

## Hook `useAuth`
**File:** `src/hooks/useAuth.tsx`

Custom hook yang mengekspos:
```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

| Property | Tipe | Deskripsi |
|---|---|---|
| `user` | `User \| null` | Data user yang login |
| `isAuthenticated` | `boolean` | Status autentikasi |
| `isLoading` | `boolean` | Proses cek session |
| `login(email, password)` | `Promise<void>` | Kirim request login |
| `logout()` | `Promise<void>` | Kirim request logout + clear state |

---

## Keamanan

- Cookie `session_token` menggunakan flag `HttpOnly` → tidak bisa diakses `document.cookie`
- Cookie menggunakan flag `SameSite=Strict` → proteksi CSRF
- Password tidak pernah disimpan dalam bentuk plaintext
- JWT payload hanya berisi `userId` dan `email` (tidak ada data sensitif)
