import { BRAND } from './siteConfig';

const audienceItems = [
  'Independent hotels',
  'Homestays',
  'Hostels and dorms',
  'Lodges',
  'Owners with more than one property',
];

export default function AudienceStrip() {
  return (
    <section className="mk-section pt-0">
      <div className="mk-content">
        <div className="mk-surface px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-center sm:flex-wrap">
            <p className="mk-label text-[0.72rem] text-slate-500">Built for people who run real properties.</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {audienceItems.map((item) => (
                <span key={item} className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
