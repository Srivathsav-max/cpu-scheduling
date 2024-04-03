import React, { useState } from 'react';

function FCFS() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({
    id: processes.length + 1,
    arrivalTime: 0,
    burstTime: 0,
  });

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses([...processes, { ...inputProcess, id: processes.length + 1 }]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateFCFS = (processes) => {
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    const processesWithDetails = processes.map((process) => {
      const waitingTime = Math.max(currentTime - process.arrivalTime, 0);
      const turnaroundTime = waitingTime + process.burstTime;
      currentTime += process.burstTime;
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
      return { ...process, waitingTime, turnaroundTime };
    });
    return {
      processes: processesWithDetails,
      averageWaitingTime: totalWaitingTime / processes.length,
      averageTurnaroundTime: totalTurnaroundTime / processes.length,
    };
  };

  const { processes: processedList, averageWaitingTime, averageTurnaroundTime } =
    calculateFCFS(processes);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">First Come First Serve Scheduling</h2>
      <div className="mb-4">
        <label htmlFor="arrivalTime" className="block text-gray-700 font-semibold mb-2">
          Arrival Time
        </label>
        <input
          type="number"
          id="arrivalTime"
          placeholder="Arrival Time"
          value={inputProcess.arrivalTime}
          onChange={(e) => setInputProcess({ ...inputProcess, arrivalTime: parseInt(e.target.value) })}
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
          onChange={(e) => setInputProcess({ ...inputProcess, burstTime: parseInt(e.target.value) })}
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
                <th className="px-4 py-2">Waiting Time</th>
                <th className="px-4 py-2">Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {processedList.map((process, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{process.id}</td>
                  <td className="border px-4 py-2">{process.arrivalTime}</td>
                  <td className="border px-4 py-2">{process.burstTime}</td>
                  <td className="border px-4 py-2">{process.waitingTime}</td>
                  <td className="border px-4 py-2">{process.turnaroundTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="text-gray-700">Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
          <p className="text-gray-700">Average Turnaround Time: {averageTurnaroundTime.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gantt Chart</h3>
        <div className="flex items-center">
          {processedList.map((process, index) => (
            <div key={index} className="text-center mx-2">
              <div
                className="bg-blue-300 text-white px-2 py-1 mb-1"
                style={{ width: `${process.burstTime * 10}px` }}
              >
                P{process.id}
              </div>
              <div>{process.arrivalTime + process.waitingTime}</div>
            </div>
          ))}
          <div>
            {processedList.reduce((acc, curr) => acc + curr.burstTime, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FCFS;