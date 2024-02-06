import React, { useState } from 'react';

function AccordionItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2 border rounded">
      <div className="flex items-center justify-between p-4 bg-gray-200 cursor-pointer" onClick={toggleAccordion}>
        <div className="text-lg font-bold">{title}</div>
        <svg className={`w-6 h-6 ${isOpen ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM10 4a1 1 0 011 1v6a1 1 0 01-2 0V5a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && <div className="p-4 bg-white">{content}</div>}
    </div>
  );
}

function Accordion({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
}

export default Accordion;
