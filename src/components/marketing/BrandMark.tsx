type BrandMarkProps = {
  size?: number;
  className?: string;
};

export default function BrandMark({ size = 24, className = '' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="currentColor" />
      <path d="M13 14.5v19M35 14.5v19" stroke="#C58B2A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 18h17M18 24h17M13 30h14" stroke="#FBFAF7" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
