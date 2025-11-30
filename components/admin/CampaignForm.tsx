'use client';

import { createCampaignAction } from "@/app/actions/campaign";

export default function CampaignForm({ students, circles }: any) {
    return (
        <form
            action={createCampaignAction}
            className="
        space-y-6 
        max-w-2xl 
        bg-white 
        dark:bg-gray-900
        p-6 
        rounded-2xl 
        shadow-sm 
        border 
        border-gray-200 
        dark:border-gray-700
      " encType="multipart/form-data"
        >

            {/* Name */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input
                    name="name"
                    required
                    className="
            w-full p-3 
            border 
            border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                />
            </div>

            {/* Type */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">Type</label>
                <select
                    name="type"
                    required
                    className="
            w-full p-3 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                >
                    <option value="STUDENT_SPONSORSHIP">Student Sponsorship</option>
                    <option value="CIRCLE_SPONSORSHIP">Circle Sponsorship</option>
                </select>
            </div>

            {/* Target Amount */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                    Target Amount
                </label>
                <input
                    name="targetAmount"
                    required
                    inputMode="numeric"
                    className="
            w-full p-3 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                />
            </div>

            {/* Student */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                    Student (optional)
                </label>
                <select
                    name="studentId"
                    className="
            w-full p-3 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                >
                    <option value="">— None —</option>
                    {students.map((s: any) => (
                        <option key={s.id} value={s.id}>
                            {s.fullname}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quran Circle */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                    Quran Circle (optional)
                </label>
                <select
                    name="quranCircleId"
                    className="
            w-full p-3 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                >
                    <option value="">— None —</option>
                    {circles.map((c: any) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                    Description
                </label>
                <textarea
                    name="description"
                    rows={4}
                    className="
            w-full p-3 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-lg 
            focus:ring-2 focus:ring-brand-green/40 
            focus:outline-none
          "
                ></textarea>
            </div>

            <div className="space-y-1">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                    Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    name="image"
                    className="
      w-full p-3 
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      rounded-lg 
      focus:ring-2 focus:ring-brand-green/40 
      focus:outline-none
    "
                />
            </div>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    className="
            bg-brand-green 
            text-white 
            px-6 py-3 
            rounded-lg 
            font-semibold 
            hover:bg-brand-dark 
            transition
          "
                >
                    Create Campaign
                </button>
            </div>

        </form>
    );
}
