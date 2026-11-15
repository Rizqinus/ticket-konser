export default function GigpassLogo({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Resmi Gigpass"
    >
      <defs>
        <linearGradient id="gpLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* Wadah Lencana Utama */}
      <rect width="40" height="40" rx="10" fill="url(#gpLogoGrad)" />

      {/* Siluet Tiket Konser dengan Notched Cutout */}
      <path
        d="M8 12C8 9.79 9.79 8 12 8H28C30.21 8 32 9.79 32 12V17C30.62 17 29.5 18.12 29.5 19.5C29.5 20.88 30.62 22 32 22V28C32 30.21 30.21 32 28 32H12C9.79 32 8 30.21 8 28V22C9.38 22 10.5 20.88 10.5 19.5C10.5 18.12 9.38 17 8 17V12Z"
        fill="white"
        fillOpacity="0.12"
        stroke="white"
        strokeWidth="1.25"
      />

      {/* Monogram Huruf G Dinamis */}
      <path
        d="M25.2 15.4C23.8 13.9 21.7 13 19.2 13C15.2 13 12 16.1 12 20C12 23.9 15.2 27 19.2 27C23.2 27 26.2 24.2 26.4 20.5H19"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Aksen Emas Tiket VIP */}
      <circle cx="26.4" cy="20.5" r="1.5" fill="#FBBF24" />
    </svg>
  );
}
