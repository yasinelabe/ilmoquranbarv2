import { getSponsorTransactionsAction } from "@/app/actions/transactions";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import DataTable from "@/components/admin/DataTable";

export default async function SponsorTransactionsPage({ params }: { params: { id: string } }) {
    const sponsorId = Number((await params).id);

    const sponsor = await prisma.sponsor.findUnique({ where: { id: sponsorId } });
    if (!sponsor) notFound();

    const result = await getSponsorTransactionsAction(sponsorId);
    if (!result.success) return <p>Error loading transactions</p>;

    const raw = result.data;

    if (!raw || raw.length === 0) {
        return <p>No transactions available for this sponsor</p>;
    }

    const transactions = JSON.parse(JSON.stringify(raw.map(t => ({
        ...t,
        amountFormatted: t.amount.toString(),
        campaignName: t.campaign.name,
        createdAtFormatted: new Date(t.createdAt).toLocaleString(),
    }))));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-gold">
                Transactions for {sponsor.fullname}
            </h1>

            <DataTable
                data={transactions}
                page={1}
                total={transactions.length}
                pageSize={transactions.length}
                columns={[
                    { key: "referenceId", label: "Reference" },
                    { key: "amountFormatted", label: "Amount" },
                    { key: "status", label: "Status" },
                    { key: "campaignName", label: "Campaign" },
                    { key: "createdAtFormatted", label: "Date" },
                ]}
            />
        </div>
    );
}
