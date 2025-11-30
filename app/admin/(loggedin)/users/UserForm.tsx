'use client';

import { createUserAction } from "@/app/actions/user";
import { Input } from "@/components/ui/Input";

export default function UserForm({ user }: { user?: any }) {
    return (
        <form action={createUserAction} className="space-y-6 max-w-xl bg-white p-6 rounded-2xl shadow-sm">

            {/* Fullname */}
            <div className="space-y-1">
                <label className="block font-medium text-gray-700">Fullname</label>
                <Input name="fullname"
                    defaultValue={user?.fullname ?? ''}
                    required />
            </div>

            {/* Username */}
            <div className="space-y-1">
                <label className="block font-medium text-gray-700">Username</label>
                <Input name="username"
                    defaultValue={user?.username ?? ''}
                    required />
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="block font-medium text-gray-700">Password</label>
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

        </form>
    );
}
