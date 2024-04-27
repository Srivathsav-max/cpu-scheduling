import React, { useState } from 'react';

function SPN() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({arrivalTime: '', burstTime: '' });

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses([...processes, { ...inputProcess, id: processes.length + 1 }]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateSPN = (processes) => {
    let currentTime = 0;
    const n = processes.length;
    const completed = new Array(n).fill(false);
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    let completedProcesses = 0;

    while (completedProcesses < n) {
      // Find the next process to execute
      let idx = -1;
      let minBurst = Infinity;
      for (let i = 0; i < n; i++) {
        if (!completed[i] && processes[i].arrivalTime <= currentTime && processes[i].burstTime < minBurst) {
          minBurst = processes[i].burstTime;
          idx = i;
        }
      }
      // If no process is found, increase currentTime
      if (idx === -1) {
        currentTime++;
        continue;
      }
      // Calculate waiting time and turnaround time
      waitingTime[idx] = currentTime - processes[idx].arrivalTime;
      currentTime += processes[idx].burstTime;
      turnaroundTime[idx] = currentTime - processes[idx].arrivalTime;
      completed[idx] = true;
      completedProcesses++;
    }

    return processes.map((process, index) => ({
      ...process,
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index],
    }));
  };

  const processedList = processes.length > 0 ? calculateSPN(processes) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shortest Process Next Scheduling</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Arrival Time"
          value={inputProcess.arrivalTime}
          onChange={(e) => setInputProcess({ ...inputProcess, arrivalTime: e.target.value })}
          className="border-2 border-gray-200 rounded py-2 px-4"
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={inputProcess.burstTime}
          onChange={(e) => setInputProcess({ ...inputProcess, burstTime: e.target.value })}
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
                  <td className="border px-4 py-2">P{process.id}</td>
                  <td className="border px-4 py-2">{process.arrivalTime}</td>
                  <td className="border px-4 py-2">{process.burstTime}</td>
                  <td className="border px-4 py-2">{process.waitingTime}</td>
                  <td className="border px-4 py-2">{process.turnaroundTime}</td>
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

export default SPN;