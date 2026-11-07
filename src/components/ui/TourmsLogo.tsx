import React from 'react';

export interface TourmsSymbolProps {
  size?: number | string;
  className?: string;
  monochrome?: 'white' | 'charcoal' | 'green' | false;
}

/**
 * Exact geometric reproduction of the Tourms Master Symbol:
 * - Slanted top crossbar (parallelogram angled upwards to the right at 25°)
 * - Deep Tourms Green left vertical pillar (#0E5A46)
 * - Amber / Copper right vertical pillar (#C98A3A)
 */
export const TourmsSymbol: React.FC<TourmsSymbolProps> = ({
  size = 32,
  className = '',
  monochrome = false
}) => {
  const greenColor = monochrome === 'white' ? '#FFFFFF' : monochrome === 'charcoal' ? '#0F1F1C' : '#0E5A46';
  const copperColor = monochrome === 'white' ? '#FFFFFF' : monochrome === 'charcoal' ? '#0F1F1C' : '#C98A3A';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Tourms Master Symbol"
    >
      {/* Top Crossbar - Slanted Angled Parallelogram */}
      <path
        d="M12 40 L72 14 L88 22 L28 48 Z"
        fill={greenColor}
      />
      {/* Crossbar 3D subtle top facet for depth */}
      <path
        d="M12 40 L28 48 L88 22 L86 21 L26 47 Z"
        fill={monochrome ? 'currentColor' : '#147A60'}
        opacity="0.3"
      />

      {/* Left Vertical Pillar (Deep Tourms Green) */}
      <path
        d="M28 50 L46 42 L46 88 L28 88 Z"
        fill={greenColor}
      />

      {/* Right Vertical Pillar (Amber / Copper) */}
      <path
        d="M56 38 L74 30 L74 88 L56 88 Z"
        fill={copperColor}
      />
    </svg>
  );
};

export interface TourmsLogoProps {
  variant?: 'master' | 'agro-solutions' | 'workforce';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * Full Tourms Logo Lockup with custom typography and official brand lockup
 */
export const TourmsLogo: React.FC<TourmsLogoProps> = ({
  variant = 'agro-solutions',
  size = 'md',
  theme = 'light',
  className = ''
}) => {
  const symbolSizes = {
    sm: 24,
    md: 32,
    lg: 40
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl'
  };

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <TourmsSymbol
        size={symbolSizes[size]}
        monochrome={isDark ? false : false}
      />
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className={`font-extrabold tracking-tight font-display ${textClasses[size]} ${
              isDark ? 'text-white' : 'text-[#0F1F1C]'
            }`}
          >
            TOURMS
          </span>
          {variant === 'agro-solutions' && (
            <span
              className={`font-bold tracking-wider uppercase text-[10px] md:text-xs font-display ${
                isDark ? 'text-[#34D399]' : 'text-[#0E5A46]'
              }`}
            >
              AGRO-SOLUTIONS
            </span>
          )}
          {variant === 'workforce' && (
            <span
              className={`font-bold tracking-wider uppercase text-[10px] md:text-xs font-display ${
                isDark ? 'text-[#C98A3A]' : 'text-[#C98A3A]'
              }`}
            >
              WORKFORCE
            </span>
          )}
        </div>
        {size === 'lg' && (
          <span className="text-[9px] tracking-widest uppercase font-semibold text-[#8A9C96] mt-0.5">
            SAME SOUND, DIFFERENT FREQUENCY.
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Brand Frequency Rhythm Graphic System
 * Derived from the T symbol: Rhythm of slanted vertical bars alternating in green and amber.
 */
export const TourmsFrequencyRhythm: React.FC<{
  bars?: number;
  className?: string;
  height?: number;
}> = ({ bars = 11, className = '', height = 28 }) => {
  return (
    <div
      className={`inline-flex items-end gap-1 select-none pointer-events-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Vary heights to form subtle rhythmic wave derived from brand guidelines
        const heights = [60, 80, 100, 90, 85, 75, 80, 95, 100, 75, 55];
        const h = heights[i % heights.length];
        const isCopper = i >= 4 && i <= 7;
        const color = isCopper ? 'bg-[#C98A3A]' : 'bg-[#0E5A46]';

        return (
          <div
            key={i}
            className={`w-1 sm:w-1.5 rounded-t-xs ${color} transition-all`}
            style={{
              height: `${h}%`,
              transform: 'skewY(-15deg)',
              transformOrigin: 'bottom left'
            }}
          />
        );
      })}
    </div>
  );
};
