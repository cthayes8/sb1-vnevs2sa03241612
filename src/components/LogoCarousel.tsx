interface LogoCarouselProps {
  className?: string;
}

const items = [
  { type: 'logo', src: '/logos/salesforce-svgrepo-com (1).svg', alt: 'Salesforce' },
  { type: 'text', name: 'ServiceNow' },
  { type: 'logo', src: '/logos/zoho-svgrepo-com.svg', alt: 'Zoho' },
  { type: 'text', name: 'Freshdesk' },
  { type: 'logo', src: '/logos/hubspot-svgrepo-com.svg', alt: 'HubSpot' },
  { type: 'text', name: 'QuickBooks' },
  { type: 'logo', src: '/logos/zendesk-icon-svgrepo-com.svg', alt: 'Zendesk' },
  { type: 'logo', src: '/logos/slack-svgrepo-com.svg', alt: 'Slack' },
  { type: 'logo', src: '/logos/microsoft-teams-svgrepo-com.svg', alt: 'Microsoft Teams' },
];

export default function LogoCarousel({ className }: LogoCarouselProps) {
  return (
    <section className="bg-white py-16">
      <div className={`mx-auto max-w-7xl px-6 lg:px-8 ${className || ''}`}>
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Our Integration Partners
        </h2>
        <div className="relative mt-10 overflow-hidden">
          <div className="flex animate-scroll space-x-12 lg:space-x-16">
            {[...items, ...items].map((item, idx) => (
              <div
                key={idx}
                className="flex-none grayscale transition hover:grayscale-0"
              >
                {item.type === 'logo' ? (
                  <img
                    className="h-8 w-auto"
                    src={item.src}
                    alt={item.alt}
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 