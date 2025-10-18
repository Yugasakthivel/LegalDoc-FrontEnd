import React, { useState } from 'react';

function ChatBox() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = () => {
    // Simulate fetching an answer
    setAnswer(`Answer to: ${question}`);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
      <textarea
        className="border p-2 w-full rounded mb-4"
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
      />
      <button
        onClick={handleAsk}
        className="bg-primary text-white p-2 rounded"
        disabled={!question}
      >
        Ask
      </button>
      {answer && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <p className="font-semibold">Answer:</p>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
