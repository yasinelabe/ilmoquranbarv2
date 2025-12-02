"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DataTable({
    columns,
    data,
    total,
    page,
    pageSize,
    filters = [],
}: {
    columns: { key: string; label: string; render?: (row: any) => any }[]
    data: any[]
    total: number
    page: number
    pageSize: number
    filters?: { name: string; options: { label: string; value: string }[] }[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const maxPage = Math.ceil(total / pageSize)

    const updateQuery = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "" || value === undefined || value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        if (key !== "page") {
            params.set("page", "1"); // reset only on filters/search
        }

        startTransition(() => {
            router.replace(`?${params.toString()}`);
        });
    };


    return (
        <div className="space-y-4">

            {/* ==== Filters & Search ==== */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search..."
                    defaultValue={searchParams.get("search") || ""}
                    className="border px-3 py-2 rounded-xl bg-gray-800/90 text-white"
                    onChange={(e) => updateQuery("search", e.target.value)}
                />

                {/* Filters */}
                {filters.map(filter => (
                    <select
                        key={filter.name}
                        className="border px-3 py-2 rounded-xl bg-gray-800/90"
                        defaultValue={searchParams.get(filter.name) || ""}
                        onChange={(e) => updateQuery(filter.name, e.target.value)}
                    >
                        <option value="">All {filter.name}</option>
                        {filter.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ))}

            </div>

            {/* ==== Table ==== */}
            <div className="bg-gray-800/90 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-sm uppercase text-gray-400">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="p-4">{col.label}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.length === 0 && (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-6 text-center text-white" colSpan={columns.length}>
                                    No results
                                </td>
                            </tr>
                        )}

                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                {columns.map(col => (
                                    <td key={col.key} className="p-4 text-white">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ==== Pagination ==== */}
            {maxPage > 1 && (
                <div className="flex justify-between items-center mt-4">

                    <button
                        disabled={page <= 1 || isPending}
                        onClick={() => updateQuery("page", String(page - 1))}
                        className="bg-gray-800/90 px-4 py-2 border rounded-xl disabled:opacity-40 flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    <span>Page {page} of {maxPage}</span>

                    <button
                        disabled={page >= maxPage || isPending}
                        onClick={() => updateQuery("page", String(page + 1))}
                        className="bg-gray-800/90 px-4 py-2 border rounded-xl disabled:opacity-40 flex items-center gap-2"
                    >
                        Next <ChevronRight size={16} />
                    </button>

                </div>
            )}
        </div>
    )
}
