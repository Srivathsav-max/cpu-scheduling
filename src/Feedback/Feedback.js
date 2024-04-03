import React, { useState, useEffect } from 'react';

function Feedback() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({ id: 1, arrivalTime: 0, burstTime: 0 });
  const [quantums, setQuantums] = useState([4, 8, 12]); // Quantum times for each queue level
  const [currentTime, setCurrentTime] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    let interval = null;
    if (processes.length > 0) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
        processFeedback();
      }, 1000); // Each second represents a unit of time in the simulation
    }
    return () => clearInterval(interval);
  }, [processes]);

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses([
        ...processes,
        { ...inputProcess, id: processes.length + 1, remainingTime: inputProcess.burstTime, level: 0, completed: false },
      ]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const processFeedback = () => {
    let processQueue = processes.filter((p) => !p.completed && p.arrivalTime <= currentTime);
    if (processQueue.length === 0) return;
    // Sort by queue level; lower levels have higher priority
    processQueue.sort((a, b) => a.level - b.level);
    const process = processQueue[0]; // Get the first process in the sorted queue
    process.remainingTime -= 1;
    setLog([...log, `Processing Process ${process.id} at time ${currentTime}`]);
    if (process.remainingTime === 0) {
      // Process is completed
      setProcesses(
        processes.map((p) => {
          if (p.id === process.id) {
            return { ...p, completed: true };
          }
          return p;
        })
      );
      setLog([...log, `Process ${process.id} completed at time ${currentTime + 1}`]);
    } else if ((currentTime + 1 - process.lastExecutedTime) % quantums[process.level] === 0) {
      // Time quantum for the current level is exhausted; move to the next level
      setProcesses(
        processes.map((p) => {
          if (p.id === process.id && p.level < quantums.length - 1) {
            return { ...p, level: p.level + 1, lastExecutedTime: currentTime + 1 };
          }
          return p;
        })
      );
    }
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
      <button
        onClick={addProcess}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Add Process
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