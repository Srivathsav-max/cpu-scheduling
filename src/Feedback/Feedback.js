import React, { useState } from 'react';

function Feedback() {
  const [inputProcess, setInputProcess] = useState({ arrivalTime: 0, burstTime: 0 });
  const [processes, setProcesses] = useState([]);
  const [log, setLog] = useState([]);
  const [time, setTime] = useState(0);

  // Add a new process based on user input
  const addProcess = () => {
    const newProcess = {
      id: processes.length + 1,
      arrivalTime: inputProcess.arrivalTime,
      burstTime: inputProcess.burstTime,
      remainingTime: inputProcess.burstTime,
      completed: false,
      currentQueue: 0
    };
    setProcesses(prev => [...prev, newProcess]);
    setInputProcess({ arrivalTime: 0, burstTime: 0 }); // Reset input form
  };

  // Simulate scheduling
  const runScheduler = () => {
    let localProcesses = [...processes];
    let localLog = [...log];
    let currentTime = time;

    // Run the next step of the scheduler
    const step = () => {
      let anyActive = false;

      for (let process of localProcesses) {
        if (!process.completed && process.arrivalTime <= currentTime) {
          anyActive = true;
          let quantum = Math.pow(2, process.currentQueue);
          let timeSpent = Math.min(process.remainingTime, quantum);
          process.remainingTime -= timeSpent;
          currentTime += timeSpent;
          localLog.push(`Process ${process.id} ran for ${timeSpent} unit${timeSpent > 1 ? 's' : ''} at time ${currentTime}.`);
          
          if (process.remainingTime > 0) {
            process.currentQueue++;
          } else {
            process.completed = true;
            localLog.push(`Process ${process.id} completed at time ${currentTime}.`);
          }
          break; // Only process one at a time for better UI feedback
        }
      }

      if (anyActive) {
        setTimeout(step, 1000); // Delay next step for better visualization
      }

      setLog(localLog);
      setProcesses(localProcesses);
      setTime(currentTime);
    };

    step();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback Scheduling</h2>
      <div className="mb-4">
        <label htmlFor="arrivalTime" className="block text-gray-700 font-semibold mb-2">
          Arrival Time
        </label>
        <input
          type="number"
          id="arrivalTime"
          placeholder="Arrival Time"
          value={inputProcess.arrivalTime}
          onChange={(e) => setInputProcess({ ...inputProcess, arrivalTime: parseInt(e.target.value, 10) })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="burstTime" className="block text-gray-700 font-semibold mb-2">
          Burst Time
        </label>
        <input
          type="number"
          id="burstTime"
          placeholder="Burst Time"
          value={inputProcess.burstTime}
          onChange={(e) => setInputProcess({ ...inputProcess, burstTime: parseInt(e.target.value, 10) })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button onClick={addProcess} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md">
        Add Process
      </button>
      <button onClick={runScheduler} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md ml-4">
        Run Scheduler
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processes</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Arrival Time</th>
                <th className="px-4 py-2">Burst Time</th>
                <th className="px-4 py-2">Remaining Time</th>
                <th className="px-4 py-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{process.id}</td>
                  <td className="border px-4 py-2">{process.arrivalTime}</td>
                  <td className="border px-4 py-2">{process.burstTime}</td>
                  <td className="border px-4 py-2">{process.remainingTime}</td>
                  <td className="border px-4 py-2">{process.completed ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Log</h3>
        <div className="bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-48">
          <ul>
            {log.map((entry, index) => (
              <li key={index} className="text-gray-700">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
