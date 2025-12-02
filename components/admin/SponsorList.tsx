import { Sponsor } from '../../prisma/generated/client';

interface SponsorListProps {
  sponsors: Pick<Sponsor, 'id' | 'fullname' | 'email'>[];
  campaignName: string;
}

export default function SponsorList({ sponsors, campaignName }: SponsorListProps) {
  return (
    <div className="border rounded-xl shadow-sm bg-white text-gray-800">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Sponsors for "{campaignName}"</h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
        <p className="text-sm font-medium text-gray-700">
          <strong>{sponsors.length}</strong> unique sponsors identified.
        </p>

        <ul className="list-disc ml-4 space-y-1 text-sm">
          {sponsors.slice(0, 10).map((sponsor) => (
            <li key={sponsor.id}>
              {sponsor.fullname} ({sponsor.email || 'No Email'})
            </li>
          ))}

          {sponsors.length > 10 && (
            <li className="font-semibold text-gray-500">
              ...and {sponsors.length - 10} more.
            </li>
          )}
        </ul>

        {sponsors.length === 0 && (
          <p className="text-center text-gray-500">
            No transactions found for this campaign.
          </p>
        )}
      </div>
    </div>
  );
}
