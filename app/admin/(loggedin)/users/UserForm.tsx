'use client';

import { createUserAction } from "@/app/actions/user";
import { Input } from "@/components/ui/Input";

export default function UserForm({ user }: { user?: any }) {
    return (

        <div className="max-w-md mx-auto">
            <form action={createUserAction} className="bg-white text-gray-700 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">

                {/* Fullname */}
                <div className="space-y-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Fullname</label>
                    <Input name="fullname"
                        defaultValue={user?.fullname ?? ''}
                        required />
                </div>

                {/* Username */}
                <div className="space-y-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Username</label>
                    <Input name="username"
                        defaultValue={user?.username ?? ''}
                        required />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <Input name="password"
                        type="password"
                        required={!user}
                        placeholder={user ? "Leave blank to keep current password" : ""} />
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        className="bg-brand-green hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        {user ? "Update User" : "Create User"}
                    </button>
                </div>

            </form></div>
    );
}
