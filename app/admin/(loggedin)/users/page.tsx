import { deleteUserAction, toggleUserActiveAction } from "@/app/actions/user";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-green dark:text-white">
                    Users
                </h1>

                <Link
                    href="/admin/users/new"
                    className="bg-brand-gold text-white px-4 py-2 rounded-xl hover:bg-[#c9952f] transition-colors font-bold"
                >
                    + New User
                </Link>
            </div>

            {/* Table Wrapper */}
            <div className="
                bg-white 
                dark:bg-gray-900 
                rounded-2xl 
                overflow-hidden 
                border 
                border-gray-200 
                dark:border-gray-700
            ">
                <table className="w-full text-left">
                    
                    {/* Table Header */}
                    <thead className="
                        bg-gray-50 
                        dark:bg-gray-800 
                        text-sm 
                        uppercase 
                        text-gray-600 
                        dark:text-gray-300
                    ">
                        <tr>
                            <th className="p-3 text-left">Fullname</th>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {users.map((u) => (
                            <tr
                                key={u.id}
                                className="
                                    border-t 
                                    border-gray-200 
                                    dark:border-gray-700
                                    hover:bg-gray-50 
                                    dark:hover:bg-gray-800
                                    transition-colors
                                "
                            >
                                <td className="p-3 text-gray-800 dark:text-gray-200">
                                    {u.fullname}
                                </td>

                                <td className="p-3 text-gray-800 dark:text-gray-200">
                                    {u.username}
                                </td>

                                {/* Status toggle */}
                                <td className="p-3">
                                    <form action={toggleUserActiveAction}>
                                        <input type="hidden" name="id" value={u.id} />
                                        <button
                                            type="submit"
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                u.isActive
                                                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                                                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                                            }`}
                                        >
                                            {u.isActive ? "Active" : "Disabled"}
                                        </button>
                                    </form>
                                </td>

                                {/* Actions */}
                                <td className="p-3 flex gap-3 justify-center">
                                    <Link
                                        href={`/admin/users/${u.id}`}
                                        className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
                                    >
                                        Edit
                                    </Link>

                                    <form action={deleteUserAction}>
                                        <input type="hidden" name="id" value={u.id} />
                                        <button
                                            type="submit"
                                            className="text-red-600 dark:text-red-300 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
