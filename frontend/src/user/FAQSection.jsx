import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch, FiRefreshCw, FiMail, FiHelpCircle } from "react-icons/fi";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);

const faqs = [
   {
      question: "Is the verification system secure?",
      answer:
        "Yes, it uses encryption, role-based access, CAPTCHA protection, and is integrated with national ID verification for enhanced security.",
      tags: ["security", "safety", "authentication"],
    },
    {
      question: "How do I verify a graduate's document?",
      answer:
        "Enter the Document ID or graduate details in the verification portal. The system will instantly validate it against GLA University's records.",
      tags: ["verify", "document", "process"],
    },
    {
      question: "What document types can I verify?",
      answer:
        "Degrees, diplomas, certificates, and transcripts issued by GLA University.",
      tags: ["document", "types", "supported"],
    },
    {
      question: "Is there a limit to how many documents I can verify?",
      answer:
        "No, but bulk verification requires special access. Contact support for assistance.",
      tags: ["limit", "bulk", "multiple"],
    },
    {
      question: "Why does a document show as 'invalid'?",
      answer:
        "This could mean: (1) The document is forged, (2) It's not yet issued, or (3) There's a system error. Contact support@GLAu.edu.et for clarification.",
      tags: ["invalid", "error", "troubleshoot"],
    },
    {
      question: "Can I verify documents from other universities?",
      answer:
        "No, this system only verifies credentials issued by GLA University.",
      tags: ["other", "universities", "external"],
    },
    {
      question: "How long are verification reports valid?",
      answer:
        "Reports are valid indefinitely but reflect the database status at verification time. Re-verify for current status.",
      tags: ["validity", "expiry", "report"],
    },
   
    {
      question: "Can I track my previous verification attempts?",
      answer:
        "Currently, tracking is available for authenticated institutional users. Guest users may not retain a history.",
      tags: ["tracking", "history", "audit"],
    },
    {
      question: "How does the system prevent fake certificates?",
      answer:
        "All graduate credentials are digitally signed and cross-checked with GLA University's internal registry. Any mismatch is flagged.",
      tags: ["fake", "forgery", "protection"],
    },
    {
      question: "What technologies does the system use?",
      answer:
        "The system is built on the MERN stack (MongoDB, Express.js, React, Node.js) and integrates PDF generation, email verification, and CAPTCHA.",
      tags: ["technology", "tech stack", "framework"],
    },
    {
      question: "How do I request bulk access or API integration?",
      answer:
        "Please email registrar@GLAu.edu.et with your organization's details and verification needs. We'll guide you through API access.",
      tags: ["bulk", "api", "integration"],
    },
    {
      question: "What should I do if I suspect a forged document?",
      answer:
        "Don't worry about that alreay get Email verification@GLAu.edu.et with details. Our team will investigate immediately.",
      tags: ["fraud", "forged", "report"],
    },
  ];

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get FAQs to display
  const displayedFAQs = searchQuery ? filteredFAQs : filteredFAQs.slice(0, displayCount);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const resetFAQs = () => {
    setDisplayCount(6);
    setSearchQuery("");
    setActiveIndex(null);
  };

  const popularTags = ['verification', 'documents', 'security', 'transcripts', 'degrees'];

  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 mb-4">
            <FiHelpCircle className="mr-1" /> FAQs
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            How can we help?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about document verification and university services.
          </p>
        </div>
        
        {/* Search and Reset */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search questions, answers, or tags..."
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={resetFAQs}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border-2 border-gray-200 shadow-sm transition-all duration-200"
          >
            <FiRefreshCw className="shrink-0" />
            <span>Reset</span>
          </button>
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <p className="text-center mb-8 text-gray-600">
            Found {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"} for "<span className="font-medium text-gray-700">{searchQuery}</span>"
          </p>
        )}

        {/* FAQ List */}
        <div className="space-y-4 mb-10 ">
          {displayedFAQs.length > 0 ? (
            displayedFAQs.map((faq, index) => (
              <div 
                key={index} 
                className="border-2 p-2 border-gray-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  {activeIndex === index ? (
                    <FiChevronUp className="text-gray-500 shrink-0 text-xl" />
                  ) : (
                    <FiChevronDown className="text-gray-500 shrink-0 text-xl" />
                  )}
                </button>
                
                {activeIndex === index && (
                  <div className="p-6 bg-gray-50 border-t-2 border-gray-200 animate-fadeIn">
                    <p className="text-gray-600 mb-4">
                      {faq.answer}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg 
                    className="w-8 h-8 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any FAQs matching "<span className="font-medium text-gray-600">{searchQuery}</span>".
                  Try these popular topics:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!searchQuery && filteredFAQs.length > displayCount && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-black font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <svg 
                  className="w-5 h-11 mr-2 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
                Load More FAQs
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        )}

        {/* Support Contact */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full mb-6">
            <FiMail className="mr-2" />
            Still need help?
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is ready to help you with any questions about document verification or university services.
          </p>
          <a
            href="mailto:support@GLAu.edu.et"
            className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FiMail className="mr-2" />
            Contact Support Team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
