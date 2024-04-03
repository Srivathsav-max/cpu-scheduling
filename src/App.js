import React, { useState } from 'react';
import FCFS from './FCFS/FCFS';
import SRT from './SRT/SRT';
import SPN from './SPN/SPN';
import HRRN from './HRRN/HRRN';
import Feedback from './Feedback/Feedback';
import RR from './RR/RR';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          CPU Scheduling Simulator
        </h1>
        <div>
          <label
            htmlFor="algorithm"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Algorithm
          </label>
          <div className="relative">
            <select
              id="algorithm"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
            >
              <option value="">Select an algorithm</option>
              <option value="FCFS">First Come First Serve</option>
              <option value="SRT">Shortest Remaining Time</option>
              <option value="SPN">Shortest Process Next</option>
              <option value="HRRN">Highest Response Ratio Next</option>
              <option value="Feedback">Feedback</option>
              <option value="RR">Round Robin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {selectedAlgorithm === 'FCFS' && <FCFS />}
          {selectedAlgorithm === 'SRT' && <SRT />}
          {selectedAlgorithm === 'SPN' && <SPN />}
          {selectedAlgorithm === 'HRRN' && <HRRN />}
          {selectedAlgorithm === 'Feedback' && <Feedback />}
          {selectedAlgorithm === 'RR' && <RR />}
        </div>
      </div>
      <footer className="bg-transparent text-gray-500 py-4">
        <p className="text-center">© 2024 CPU Scheduling Simulator Team 1</p>
        <p className="text-center">by Srivathsav ❤️</p>
      </footer>
    </div>
  );
}

export default App;