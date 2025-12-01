"use client";

import { useState } from "react";
import { CampaignCard } from "./CampaignCard";

interface CampaignSectionProps {
  activeCampaigns: any[];
  dict: any;
  locale: any;
}

export default function CampaignSection({ activeCampaigns, dict,locale }: CampaignSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // EMPTY STATE
  if (!activeCampaigns || activeCampaigns.length === 0) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-3xl font-extrabold text-brand-gold dark:text-white mb-3">
          {dict?.campaigns?.sectionTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {dict?.campaigns?.none}
        </p>
      </section>
    );
  }

  // NORMAL STATE
  const visibleCampaigns = showAll
    ? activeCampaigns
    : activeCampaigns.slice(0, 10);

  return (
    <section className="py-10">
      <h2 className="text-3xl font-extrabold text-center text-brand-gold dark:text-white mb-3">
        {dict.campaigns.sectionTitle}
      </h2>
      <p className="text-center mb-8">{dict.campaigns.sectionDescription}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCampaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} locale={locale} dict={dict} />
        ))}
      </div>

      {!showAll && activeCampaigns.length > 10 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-gold transition"
          >
            {dict.campaigns.showAll}
          </button>
        </div>
      )}
    </section>
  );
}