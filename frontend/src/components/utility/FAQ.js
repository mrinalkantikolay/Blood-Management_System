import React, { useState } from 'react';
import './utility.css';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Who can donate blood?",
      answer: "Most people in good health, aged between 18-65, weighing at least 110 pounds can donate blood. However, eligibility may vary based on medical history and current health status."
    },
    {
      question: "How often can I donate blood?",
      answer: "Whole blood donors can typically donate every 8 weeks (56 days). Platelet donors can give every 7 days up to 24 times per year."
    },
    {
      question: "How long does a blood donation take?",
      answer: "The actual blood donation takes about 8-10 minutes. However, the entire process, including registration, health screening, and refreshments afterward, takes about an hour."
    },
    {
      question: "Is blood donation safe?",
      answer: "Yes, blood donation is very safe. New, sterile disposable equipment is used for each donor, and all donors undergo health screening before donation."
    },
    {
      question: "What should I do before donating blood?",
      answer: "Get enough sleep, eat a healthy meal, drink plenty of fluids, and avoid fatty foods before donation. Bring a valid ID and list of medications you're taking."
    },
    {
      question: "What happens to my blood after donation?",
      answer: "Your blood is tested for various diseases, processed into components (red cells, platelets, plasma), and distributed to hospitals where it's needed most."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 style={{ color: '#dc3545', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <FaQuestionCircle style={{ color: '#dc3545' }} /> Frequently Asked Questions
      </h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
