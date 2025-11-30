'use client'

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, User, DollarSign, Zap } from 'lucide-react';

// Data structure based on the app/faq/page.md content
const faqData = [
  {
    category: "About Ilm Quraan Bar",
    icon: HelpCircle,
    questions: [
      {
        q: "What is Ilm Quraan Bar?",
        a: "Ilm Quraan Bar is a platform dedicated to facilitating Quranic education through organized learning circles (halqas). We connect students with qualified teachers and provide tools for progress tracking and community interaction.",
      },
      {
        q: "Who are the teachers on your platform?",
        a: "Our teachers are rigorously vetted scholars and Hafiz (those who have memorized the entire Quran) with experience in teaching recitation (Tajweed) and memorization (Hifz) according to recognized Islamic standards.",
      },
      {
        q: "What is a Quran Circle (Halqa)?",
        a: "A Quran Circle is a group learning environment where students gather virtually or physically to recite the Quran under the supervision of a teacher. Our platform organizes these circles based on student level, availability, and learning goals.",
      },
    ],
  },
  {
    category: "Payments and Waafipay",
    icon: DollarSign,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept payments primarily through Waafipay, our integrated payment solution, which supports various local and international payment channels.",
      },
      {
        q: "I made a payment, but my status hasn't updated. What should I do?",
        a: "Payments processed via Waafipay can sometimes take a few minutes to confirm. If your payment status has not updated after one hour: 1. Verify the transaction status with your payment provider. 2. Contact our support team immediately with your Transaction Reference ID and the amount paid.",
      },
      {
        q: "Is my financial information secure?",
        a: "Yes. All payments are handled by Waafipay's secure gateway. We do not store sensitive financial details (like credit card numbers) directly on our servers. We only store transaction references and status updates provided by the payment partner.",
      },
    ],
  },
];


type FaqQA = {
  q: string;
  a: string;
};

interface FaqItemProps {
  item: FaqQA;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg text-plain hover:text-brand-green transition-colors"
        onClick={onClick}
      >
        <span>{item.q}</span>
        <ChevronDown 
            className={`h-6 w-6 text-brand-gold transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        {/* Using a shade of gray for answer text for contrast */}
        <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-4 border-brand-green/50">
          {item.a}
        </p>
      </div>
    </div>
  );
};

export default function FaqSection() {
  // State to manage which question is open
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // FIX: Removed hardcoded bg-white and dark:bg-gray-900, relying on dynamic surface-contrast
    <section className="py-16 md:py-24 px-4 surface-contrast">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase text-brand-green">Support</span>
          <h2 className="text-4xl font-extrabold text-plain mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Everything you need to know about our service, learning, and platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {faqData.map((group, groupIndex) => (
            // FIX: Replaced hardcoded Tailwind grays with custom 'surface' utility
            <div key={group.category} className="surface p-6 rounded-2xl shadow-lg">
              <div className="flex items-center text-brand-gold mb-4">
                <group.icon className="h-6 w-6 mr-2" />
                {/* FIX: Replaced hardcoded Tailwind grays with dynamic 'text-plain' utility */}
                <h3 className="text-xl font-bold text-plain">{group.category}</h3>
              </div>
              
              <div className="space-y-1">
                {group.questions.map((item, itemIndex) => {
                  // Calculate unique index across all groups
                  const uniqueIndex = groupIndex * 100 + itemIndex; 
                  return (
                    <FaqItem
                      key={uniqueIndex}
                      item={item}
                      isOpen={openIndex === uniqueIndex}
                      onClick={() => toggle(uniqueIndex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}