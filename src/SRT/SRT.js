import React, { useState } from 'react';

function SRT() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({ id: 1, arrivalTime: 0, burstTime: 0 });

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses([...processes, { ...inputProcess, id: processes.length + 1, remainingTime: inputProcess.burstTime }]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateSRT = (processes) => {
    let time = 0;
    let completed = 0;
    let shortest = 0;
    let finishTime;
    let isProcessRunning = false;
    const n = processes.length;
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    const finishTimes = new Array(n).fill(0);
    const remainingTime = processes.map(process => process.burstTime);

    while (completed !== n) {
      shortest = -1;
      let minRemainingTime = Infinity;
      for (let i = 0; i < n; i++) {
        if ((processes[i].arrivalTime <= time) && (remainingTime[i] < minRemainingTime) && remainingTime[i] > 0) {
          minRemainingTime = remainingTime[i];
          shortest = i;
          isProcessRunning = true;
        }
      }
      if (shortest === -1) {
        time++;
        continue;
      }
      remainingTime[shortest]--;
      if (remainingTime[shortest] === 0) {
        completed++;
        isProcessRunning = false;
        finishTimes[shortest] = time + 1;
        waitingTime[shortest] = finishTimes[shortest] - processes[shortest].burstTime - processes[shortest].arrivalTime;
        if (waitingTime[shortest] < 0) {
          waitingTime[shortest] = 0;
        }
      }
      time++;
    }
    for (let i = 0; i < n; i++) {
      turnaroundTime[i] = processes[i].burstTime + waitingTime[i];
    }
    return processes.map((process, index) => ({
      ...process,
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index],
      finishTime: finishTimes[index], // Include the finish time here
    }));
  };

  const processedList = processes.length > 0 ? calculateSRT(processes) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shortest Remaining Time Scheduling</h2>
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
                <th className="px-4 py-2">Completion Time</th> 
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
                  <td className="border px-4 py-2">{process.finishTime}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gantt Chart can be implemented similarly as in the FCFS example */}
    </div>
  );
}

export default SRT;
