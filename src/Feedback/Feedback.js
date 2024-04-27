import React, { useState, useEffect } from 'react';

function Feedback() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({ id: 1, arrivalTime: '', burstTime: '' });
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
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback Scheduling</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* <label htmlFor="arrivalTime" className="border-2 border-gray-200 rounded py-2 px-4">
          Arrival Time
        </label> */}
        <input
          type="number"
          id="arrivalTime"
          placeholder="Arrival Time"
          value={inputProcess.arrivalTime}
          onChange={(e) => setInputProcess({ ...inputProcess, arrivalTime: parseInt(e.target.value, 10) })}
          className="border-2 border-gray-200 rounded py-2 px-4"
        />
      {/* </div> */}
      {/* <div className="mb-4">
        <label htmlFor="burstTime" className="border-2 border-gray-200 rounded py-2 px-4">
          Burst Time
        </label> */}
        <input
          type="number"
          id="burstTime"
          placeholder="Burst Time"
          value={inputProcess.burstTime}
          onChange={(e) => setInputProcess({ ...inputProcess, burstTime: parseInt(e.target.value, 10) })}
          className="border-2 border-gray-200 rounded py-2 px-4"
        />
      </div>
      <button
        onClick={addProcess}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Process
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Arrival Time</th>
                <th className="px-4 py-2 border">Burst Time</th>
                <th className="px-4 py-2 border">Remaining Time</th>
                <th className="px-4 py-2 border">Completed</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td className=" px-4 py-2 border">{process.id}</td>
                  <td className=" px-4 py-2 border">{process.arrivalTime}</td>
                  <td className=" px-4 py-2 border">{process.burstTime}</td>
                  <td className=" px-4 py-2 border">{process.remainingTime}</td>
                  <td className=" px-4 py-2 border">{process.completed ? 'Yes' : 'No'}</td>
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