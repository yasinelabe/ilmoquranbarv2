import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteSponsorAction } from '@/app/actions/sponsors';

export default async function sponsorListPage() {
    const sponsors = await prisma.sponsor.findMany();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-gold dark:text-white">Sponsors</h1>

                <Link
                    href="/admin/sponsors/create"
                    className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
                >
                    + Add Sponsor
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-sm uppercase text-gray-500">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {sponsors.map((sponsor) => (
                            <tr key={sponsor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-4 font-bold text-gray-700 dark:text-gray-200">{sponsor.fullname}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">
                                    {sponsor.phone}
                                </td>
                                <td className="p-4 text-brand-gold dark:text-brand-gold">{sponsor.email}</td>
                                <td className="p-4 flex justify-end gap-2">
                                    <Link href={`/admin/sponsors/${sponsor.id}`} className="p-2 text-gray-400 hover:text-brand-gold">
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/admin/sponsors/${sponsor.id}/transactions`}
                                        className="p-2 text-gray-400 hover:text-blue-500"
                                        title="View Transactions"
                                    >
                                        Transactions
                                    </Link>
                                    <DeleteButton action={deleteSponsorAction} itemId={sponsor.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}