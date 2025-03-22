import React, { useState } from "react";

const Diary = () => {
  // Initialize an array of 15 empty strings for diary entries
  const initialEntries = Array(15).fill("");
  const [entries, setEntries] = useState(initialEntries);
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (index, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = value;
    setEntries(updatedEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting diary entries..."); // Debug log
    setIsProcessing(true);
    setResult("");

    try {
      // Use the full URL of the Flask backend
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: entries }),
      });

      const data = await response.json();
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult("Your Depression Level: " + data.prediction);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred. Please try again.");
    }
    setIsProcessing(false);
  };

  const handleReset = () => {
    setEntries(initialEntries);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-3xl text-blue-600 mb-4">
        Depression Diary
      </h1>
      <p className="text-center text-gray-600 mb-6 text-lg">
        Welcome to the Depression Diary. Please write a short entry for each of
        the past 15 days describing how you felt. After entering your entries,
        click "Get Depression Level" to receive an assessment based on your
        writings.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="text-blue-600 text-xl mb-2">Day {index + 1}</h3>
              <label
                htmlFor={`day${index + 1}-text`}
                className="block mb-1 text-sm text-blue-600"
              >
                How did you feel today?
              </label>
              <textarea
                id={`day${index + 1}-text`}
                name={`day${index + 1}`}
                rows="5"
                placeholder="Write about your day and how you felt."
                maxLength="500"
                value={entry}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-base resize-none"
              ></textarea>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            type="submit"
            disabled={isProcessing}
            style={{ backgroundColor: "#0066cc", color: "#ffffff" }}
            className="px-6 py-3 font-medium rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Get Depression Level"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ backgroundColor: "#0066cc", color: "#ffffff" }}
            className="px-6 py-3 font-medium rounded hover:opacity-90"
          >
            Reset All
          </button>
        </div>
      </form>
      <div id="result" className="mt-6 text-center text-xl text-gray-800">
        {result}
      </div>
    </div>
  );
};

export default Diary;
