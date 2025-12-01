'use client'

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, DollarSign } from 'lucide-react';

type QA = { q: string; a: string };
type Category = { key: string; title: string; items: QA[] };

interface FaqSectionProps {
  dict?: any; // server-provided dictionary object
}

const FaqItem: React.FC<{
  item: QA;
  isOpen: boolean;
  onClick: () => void;
  id: string;
}> = ({ item, isOpen, onClick, id }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg text-plain hover:text-brand-gold transition-colors"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`answer-${id}`}
      >
        <span>{item.q}</span>
        <ChevronDown
          className={`h-6 w-6 text-brand-gold transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <div
        id={`answer-${id}`}
        role="region"
        aria-labelledby={id}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-4 border-brand-green/50">
          {item.a}
        </p>
      </div>
    </div>
  );
};

export default function FaqSection({ dict }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // load categories from dict, fallback if missing
  const categories: Category[] = dict.faq.categories;

  // header strings
  const supportLabel = dict?.faq?.supportLabel ?? 'Support';
  const title = dict?.faq?.title ?? 'Frequently Asked Questions';
  const subtitle = dict?.faq?.subtitle ?? 'Everything you need to know about our service, learning, and platform.';

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 px-4 surface-contrast">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase text-brand-gold">{supportLabel}</span>
          <h2 className="text-4xl font-extrabold text-plain mt-2">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {categories.map((group, groupIndex) => {
            // choose icon by key (simple mapping)
            const Icon = group.key === 'payments' ? DollarSign : HelpCircle;

            return (
              <div key={group.key} className="surface p-6 rounded-2xl shadow-lg">
                <div className="flex items-center text-brand-gold mb-4">
                  <Icon className="h-6 w-6 mr-2" />
                  <h3 className="text-xl font-bold text-plain">{group.title}</h3>
                </div>

                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => {
                    const uniqueIndex = groupIndex * 100 + itemIndex;
                    const id = `faq-${group.key}-${itemIndex}`;
                    return (
                      <FaqItem
                        key={id}
                        item={item}
                        isOpen={openIndex === uniqueIndex}
                        onClick={() => toggle(uniqueIndex)}
                        id={id}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
