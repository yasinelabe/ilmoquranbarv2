import { prisma } from '@/lib/db'
import { LayoutDashboard } from 'lucide-react'

// Server Component: Dashboard Page
export default async function DashboardPage() {
  // Metrics
  const [totalStudents, totalMosques, totalCampaigns, totalSponsors, totalTeachers] = await Promise.all([
    prisma.student.count(),
    prisma.mosque.count(),
    prisma.campaign.count(),
    prisma.sponsor.count(),
    prisma.teacher.count(),
  ])

  // Donations: total collected (all campaigns), total completed transactions sum
  const campaignsAgg = await prisma.campaign.aggregate({
    _sum: { collectedAmount: true },
  })

  const transactionsCompletedAgg = await prisma.transaction.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  })

  const totalCollected = (campaignsAgg._sum.collectedAmount ?? 0).toString()
  const totalDonations = (transactionsCompletedAgg._sum.amount ?? 0).toString()

  // Top campaigns by collectedAmount
  const topCampaigns = JSON.parse(JSON.stringify(await prisma.campaign.findMany({
    orderBy: { collectedAmount: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      collectedAmount: true,
      targetAmount: true,
      image: true,
      isComplete: true,
    }
  })))

  // Recent transactions (10 most recent)
  const recentRaw = JSON.parse(JSON.stringify(await prisma.transaction.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { sponsor: true, campaign: true }
  })))

  // Monthly donations (last 6 months)
  const now = new Date()
  const months: { label: string; start: Date; end: Date }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    months.push({ label: d.toLocaleString('default', { month: 'short' }), start, end })
  }

  const monthlyPromises = months.map(m =>
    prisma.transaction.aggregate({
      where: { createdAt: { gte: m.start, lt: m.end }, status: 'COMPLETED' },
      _sum: { amount: true }
    })
  )
  const monthlyAgg = await Promise.all(monthlyPromises)

  // Serialize results to plain JSON (fix Decimal/Date)
  const recent = recentRaw
  const top = topCampaigns
  const monthly = monthlyAgg.map(v => ({ amount: (v._sum.amount ?? 0).toString() }))

  // Helper: render a simple SVG bar chart (server-side)
  const renderBarChartSVG = (values: number[], width = 600, height = 120) => {
    const max = Math.max(...values, 1)
    const barW = Math.max(6, Math.floor(width / values.length) - 6)
    const gap = 8
    const scale = (v: number) => Math.round((v / max) * (height - 16))

    const bars = values.map((v, i) => {
      const h = scale(v)
      const x = i * (barW + gap)
      const y = height - h
      return `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" />`
    }).join('\n')

    // Labels (month initials)
    const labels = values.map((_, i) => {
      const x = i * (barW + gap) + barW / 2
      return `<text x="${x}" y="${height + 14}" font-size="10" text-anchor="middle">${months[i].label}</text>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 ${Math.max(width, values.length * (barW + gap))} ${height + 30}" xmlns="http://www.w3.org/2000/svg" class="rounded-lg">\n  <g fill="currentColor" opacity="0.85">\n    ${bars}\n  </g>\n  <g fill="currentColor" opacity="0.6" font-family="Inter,ui-sans-serif,system-ui,sans-serif">\n    ${labels}\n  </g>\n</svg>`
  }

  const monthlyValues = monthly.map(m => Number(m.amount))
  const svg = renderBarChartSVG(monthlyValues, 420, 100)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-brand-gold dark:text-brand-gold flex items-center">
        <LayoutDashboard size={32} className="mr-3" /> Dashboard Overview
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Students" value={String(totalStudents)} />
        <MetricCard title="Mosques" value={String(totalMosques)} />
        <MetricCard title="Active Campaigns" value={String(totalCampaigns)} />
        <MetricCard title="Sponsors" value={String(totalSponsors)} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6   rounded-2xl shadow-lg border border-gray-100 ">
          <h2 className="text-lg font-bold mb-4">Monthly Donations (last 6 months)</h2>
          <div className="text-sm text-plain mb-3">Total donations (completed): <strong className=" dark:text-white">${totalDonations}</strong></div>
          <div className="w-full overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        </div>

        <div className="p-6   rounded-2xl shadow-lg border border-gray-100 ">
          <h2 className="text-lg font-bold mb-4">Top Campaigns</h2>
          <ul className="space-y-3">
            {(() => {
              interface CampaignItem {
                id: string | number
                name: string
                collectedAmount?: string | number | null
                targetAmount?: string | number | null
                image?: string | null
                isComplete: boolean
              }

              return (top as CampaignItem[]).map((c) => (
                <li key={String(c.id)} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                    {c.image ? <img src={String(c.image)} alt={c.name} className="w-full h-full object-cover rounded-lg" /> : c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold  dark:text-white">{c.name}</div>
                    <div className="text-sm ">{Number(c.collectedAmount).toLocaleString()} / {Number(c.targetAmount).toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-medium  ">{c.isComplete ? 'Complete' : 'Active'}</div>
                </li>
              ))
            })()}
          </ul>
        </div>
      </div>

      <div className="p-6   rounded-2xl shadow-lg border border-gray-100 ">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className=" text-sm uppercase ">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Sponsor</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recent.map((tx: {
                id: string | number;
                referenceId: string;
                sponsor?: { fullname: string };
                campaign?: { name: string };
                amount: string | number;
                status: string;
                createdAt: string | Date;
              }) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-3 font-medium">{tx.referenceId}</td>
                  <td className="p-3">{tx.sponsor?.fullname}</td>
                  <td className="p-3">{tx.campaign?.name}</td>
                  <td className="p-3">{Number(tx.amount).toLocaleString()}</td>
                  <td className="p-3">{tx.status}</td>
                  <td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6   rounded-2xl shadow-lg border border-gray-100 ">
      <p className="text-sm font-medium text-plain ">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
