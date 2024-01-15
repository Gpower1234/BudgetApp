import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/Faq.css';

function FAQ() {
  const faqData = [
    { question: 'What is this website about?', answer: 'This website helps you manage your budget and expenses.' },
    { question: 'How do i create a budget?', answer: 'To create a budget , go to the budget creation page and follow the instructions.' },
    { question: 'Can i update or delete a budget?', answer: 'Yes, you can update or delete a budget on the respective pages. Be cautious as these actions are irreversible.' },
    { question: 'Tell me about the budget detail page?', answer: 'The budget detail page provides an overview of your budget, including income, expenses, and overall financial health.' },
    { question: 'What if the date of a monthly budget ends?', answer: "Once the month of a particular budget comes to end, you won't be able to update or delete any sub budget/expenses.So ensure any pending operation(s) is carried out before the due date."}
  ];

  const [ activeIndex, setActiveIndex ] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className='faq-container' style={{ height: '100vh'}}>
      <div style={{margin: '10px', padding: '15px', border: '1px solid #87ceeb', borderRadius: '7px', marginBottom: '50px'}}>
        <h3 style={{ color: '#87ceeb' }}>FAQ</h3>
      </div>
      <div style={{ }}>
        {faqData.map((item, index) => (
          <div key={index} className='faq-item'>
            <div className={`question ${activeIndex === index ? 'active' : ''}`} onClick={() => handleToggle(index)}>
              {item.question}
            </div>
            {activeIndex === index && (
              <div className='answer'>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ