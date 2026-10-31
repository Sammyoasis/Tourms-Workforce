import React from 'react';
import { ArrowUpRight, ShieldCheck, Cpu, Compass, Users } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AboutViewProps {
  onNavigate: (path: string) => void;
  isMobilePreview?: boolean;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  isMobilePreview = false
}) => {
  return (
    <div
      className={`w-full text-left ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Header */}
      <section className="bg-white border-b border-[#C4C8C5] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
            <span>ABOUT TOURMS AGRO-SOLUTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F1F1C] tracking-tight font-display leading-[1.15]">
            AGRICULTURE, CONNECTED BETTER.
          </h1>

          <p className="text-base sm:text-lg text-[#3A4B47] leading-relaxed">
            Work, opportunity and knowledge for the people and businesses shaping agriculture across Nigeria and Africa.
          </p>
        </div>
      </section>

      {/* Philosophy & Brand Expression */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
            Brand Philosophy
          </h2>
          <h3 className="text-2xl font-extrabold text-[#0F1F1C] font-display">
            Same Sound, Different Frequency.
          </h3>
          <p className="text-sm text-[#3A4B47] leading-relaxed">
            TOURMS is the master brand. Our philosophy communicates two central principles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 bg-white rounded border border-[#C4C8C5] space-y-2">
              <h4 className="text-sm font-bold text-[#0E5A46] uppercase tracking-wider">
                Same Sound
              </h4>
              <p className="text-xs text-[#3A4B47] leading-relaxed">
                A consistent identity, shared standards, common ambition, and a recognizable way of building durable businesses and systems.
              </p>
            </div>

            <div className="p-6 bg-white rounded border border-[#C4C8C5] space-y-2">
              <h4 className="text-sm font-bold text-[#C98A3A] uppercase tracking-wider">
                Different Frequency
              </h4>
              <p className="text-xs text-[#3A4B47] leading-relaxed">
                Different industries, different markets, specialized technologies, and distinct ways of solving complex sectoral problems.
              </p>
            </div>
          </div>
        </div>

        {/* The Builder + The System */}
        <div className="space-y-4 pt-4 border-t border-[#C4C8C5]">
          <h2 className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
            Internal Creative Philosophy
          </h2>
          <h3 className="text-xl font-bold text-[#0F1F1C]">
            The Builder + The System.
          </h3>
          <p className="text-sm text-[#3A4B47] leading-relaxed">
            We reject the notion that African agriculture can be transformed through superficial digital apps or generic job boards.
            Tourms Agro-Solutions builds core workforce infrastructure connecting:
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-[#3A4B47] pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-2 shrink-0" />
              <span>
                <strong>Field Agronomists & Operators:</strong> Verified on concrete capability (tractor implement calibration, pest diagnostics, irrigation scheduling) rather than generic titles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-2 shrink-0" />
              <span>
                <strong>Agribusinesses & Commercial Farms:</strong> Provided with verifiable compliance, CAC auditing, and transparent hiring pipelines.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-2 shrink-0" />
              <span>
                <strong>Developmental Capital & Knowledge:</strong> Curating vetted grants, concessionary loans, and research briefs without hype or fabricated claims.
              </span>
            </li>
          </ul>
        </div>

        {/* Product Roadmap Horizon */}
        <div className="p-6 bg-white rounded border border-[#C4C8C5] space-y-3">
          <h3 className="text-sm font-bold text-[#0F1F1C]">
            Product Scope & Roadmap Discipline
          </h3>
          <p className="text-xs text-[#5A6E68] leading-relaxed">
            The active V1 platform focuses exclusively on <strong className="text-[#0F1F1C]">Jobs (Tourms Workforce)</strong>, <strong className="text-[#0F1F1C]">Opportunities</strong>, and <strong className="text-[#0F1F1C]">Insights</strong>.
            Future initiatives such as <em>Tourms Academy</em> and <em>Tourms Farm Management</em> remain in research and are not operational in V1.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-[#C4C8C5] flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('/jobs')}
          >
            Explore Active Jobs
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/worker/onboarding')}
          >
            Create Worker Capability Profile
          </Button>
        </div>
      </section>
    </div>
  );
};
