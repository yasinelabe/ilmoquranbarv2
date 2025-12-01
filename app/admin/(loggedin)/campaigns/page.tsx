import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function CampaignList() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { student: true, quranCircle: true }
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-gold dark:text-white">
          Campaigns
        </h1>

        <Link
          href="/admin/campaigns/create"
          className="
bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold
          "
        >
          + New Campaign
        </Link>
      </div>

      {/* Table */}
      <div
        className="
          bg-white dark:bg-gray-900
          rounded-2xl 
          overflow-hidden 
          border 
          border-gray-100 dark:border-gray-800
        "
      >
        <table className="w-full text-left">
          <thead
            className="
              bg-gray-50 dark:bg-gray-800/60
              border-b border-gray-200 dark:border-gray-700
            "
          >
            <tr>
              {['Name', 'Type', 'Target', 'Collected', 'Status', 'Action'].map((h) => (
                <th
                  key={h}
                  className="
                    p-4 
                    font-bold 
                    text-gray-600 dark:text-gray-300
                    uppercase text-sm
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => {
              const statusStyles = c.isComplete
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';

              return (
                <tr
                  key={c.id}
                  className="
                    border-b 
                    border-gray-100 dark:border-gray-800
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition
                  "
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-100">
                    {c.name}
                  </td>

                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                    {c.type.replace('_', ' ')}
                  </td>

                  <td className="p-4 text-gray-800 dark:text-gray-100">
                    ${Number(c.targetAmount).toLocaleString()}
                  </td>

                  <td className="p-4 text-brand-gold dark:text-brand-gold font-bold">
                    ${Number(c.collectedAmount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`
                        px-3 py-1 
                        rounded-full 
                        text-xs font-bold 
                        ${statusStyles}
                      `}
                    >
                      {c.isComplete ? 'Complete' : 'Active'}
                    </span>
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/admin/campaigns/${c.id}`}
                      className="text-brand-gold dark:text-brand-gold font-bold hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
