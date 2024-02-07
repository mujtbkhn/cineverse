import React, { useState } from "react";

function AccordionItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mx-auto mb-2 rounded">
      <div
        className="flex items-center justify-center p-4 mx-auto bg-gray-200 cursor-pointer md:w-1/4"
        onClick={toggleAccordion}
      >
        <div className="flex justify-center mx-auto mb-2 text-lg font-bold">{title}</div>
      </div>
      {isOpen && <div className="flex justify-center p-4 bg-white">{content}</div>}
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
