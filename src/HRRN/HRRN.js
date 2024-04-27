import React, { useState } from 'react';

function HRRN() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({arrivalTime: '', burstTime: '' });

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses([...processes, { ...inputProcess, id: processes.length + 1, remainingTime: inputProcess.burstTime }]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateHRRN = (processes) => {
    let currentTime = 0;
    const n = processes.length;
    const completed = new Array(n).fill(false);
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);
    let completedProcesses = 0;

    while (completedProcesses < n) {
      let idx = -1;
      let maxRatio = -1;
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= currentTime && !completed[i]) {
          let responseRatio = (currentTime - processes[i].arrivalTime + processes[i].burstTime) / processes[i].burstTime;
          if (responseRatio > maxRatio) {
            maxRatio = responseRatio;
            idx = i;
          }
        }
      }

      if (idx === -1) {
        currentTime++;
        continue;
      }

      waitingTime[idx] = currentTime - processes[idx].arrivalTime;
      currentTime += processes[idx].burstTime;
      completionTime[idx] = currentTime;
      turnaroundTime[idx] = currentTime - processes[idx].arrivalTime;
      completed[idx] = true;
      completedProcesses++;
    }

    return processes.map((process, index) => ({
      ...process,
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index],
      completionTime: completionTime[index]
    }));
  };

  const processedList = processes.length > 0 ? calculateHRRN(processes) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Highest Response Ratio Next Scheduling</h2>
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
                <th className="px-4 py-2">Completion Time</th>
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
                  <td className="border px-4 py-2">{process.completionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HRRN;
