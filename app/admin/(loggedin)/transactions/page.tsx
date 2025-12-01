import { prisma } from "@/lib/db";
import DataTable from "@/components/admin/DataTable";

export default async function TransactionsPage({ searchParams }: any) {
    const page = Number((await searchParams).page) || 1
    const pageSize = 10
    const search = (await searchParams).search || ""
    const statusFilter = (await searchParams).status || ""

    // Query Conditions
    const where: any = {}

    if (search) {
        where.OR = [
            { referenceId: { contains: search, lt: "insensitive" } },
            { sponsor: { fullname: { contains: search, lt: "insensitive" } } }
        ]
    }

    if (statusFilter) {
        where.status = statusFilter
    }

    // Count
    const total = await prisma.transaction.count({ where })

    const raw = await prisma.transaction.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { sponsor: true, campaign: true }
    })

    const transactions = JSON.parse(JSON.stringify(raw.map(t => ({
        ...t,
        sponsorName: t.sponsor.fullname,
        campaignName: t.campaign.name,
        amountFormatted: t.amount.toString(),
        createdAtFormatted: new Date(t.createdAt).toLocaleString(),
    }))))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-gold">Transactions</h1>

            <DataTable
                data={transactions}
                total={total}
                page={page}
                pageSize={pageSize}
                columns={[
                    { key: "referenceId", label: "Reference" },
                    { key: "sponsorName", label: "Sponsor" },
                    { key: "campaignName", label: "Campaign" },
                    { key: "amountFormatted", label: "Amount" },
                    { key: "status", label: "Status" },
                    { key: "createdAtFormatted", label: "Date" },
                ]}
                filters={[
                    {
                        name: "status",
                        options: [
                            { label: "Pending", value: "PENDING" },
                            { label: "Completed", value: "COMPLETED" },
                            { label: "Failed", value: "FAILED" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
