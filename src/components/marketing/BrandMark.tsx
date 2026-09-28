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
      <rect x="2" y="2" width="44" height="44" rx="12" fill="#0E1726" />
      <rect x="9.5" y="11.5" width="29" height="25" rx="8" fill="#0D5C4D" fillOpacity="0.15" stroke="#0D5C4D" strokeWidth="1.2" />
      <path d="M13 27.5H18.5L21.5 20.5L24.5 27.5H29.5L32.5 20.5L35.5 27.5H40" stroke="#6FD3B0" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 20.5H19.5M24 20.5H29.5M34 20.5H38" stroke="#0D5C4D" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
