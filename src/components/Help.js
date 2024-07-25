import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqData = [
    {
        question: "What is Movie Recommendation System?",
        answer: "Our Movie Recommendation System helps you discover movies and TV shows based on your viewing history and preferences."
    },
    {
        question: "How much does it cost?",
        answer: "Our Movie Recommendation System is free to use, but some content may require a subscription or purchase."
    },
    {
        question: "Where can I watch?",
        answer: "You can watch movies and TV shows on our platform on any device with an internet connection."
    },
    {
        question: "How do I cancel?",
        answer: "You can cancel your subscription at any time by going to your account settings and selecting 'Cancel Subscription'."
    },
    {
        question: "What can I watch?",
        answer: "Our platform offers a wide variety of movies and TV shows across all genres."
    },
    {
        question: "Is it suitable for kids?",
        answer: "Yes, we have a wide selection of kid-friendly content and parental controls to ensure a safe viewing experience."
    }
];

const Help = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
            {faqData.map((faq, index) => (
                <div key={index} className="mb-4">
                    <div
                        className="flex justify-between items-center bg-gray-800 p-4 rounded cursor-pointer"
                        onClick={() => toggleAnswer(index)}
                    >
                        <h2 className="text-lg">{faq.question}</h2>
                        {openIndex === index ? <FaMinus /> : <FaPlus />}
                    </div>
                    {openIndex === index && (
                        <div className="bg-gray-700 bg-opacity-60 p-4  mt-2">
                            <p>{faq.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Help;
