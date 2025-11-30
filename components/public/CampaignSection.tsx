"use client";

import { useState } from "react";
import { CampaignCard } from "./CampaignCard";

export default function CampaignSection({ activeCampaigns }: { activeCampaigns: any[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleCampaigns = showAll
    ? activeCampaigns
    : activeCampaigns.slice(0, 10);

  return (
    <section className="py-10">
      <h2 className="text-3xl font-extrabold text-center text-brand-green dark:text-white mb-3">
        Active Campaigns
      </h2>
      <p className="text-center mb-8">Choose a circle or student to sponsor and make an immediate impact.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCampaigns.map((c: any) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {/* SHOW ALL BUTTON */}
      {!showAll && activeCampaigns.length > 10 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-gold transition"
          >
            Show All
          </button>
        </div>
      )}
    </section>
  );
}
