import React, { useState } from 'react';

function HRRN() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({ id: 1, arrivalTime: 0, burstTime: 0 });
  const [currentTime, setCurrentTime] = useState(0);

  const addProcess = () => {
    if (inputProcess.burstTime > 0) {
      setProcesses(prevProcesses => [
        ...prevProcesses,
        { ...inputProcess, id: prevProcesses.length + 1, remainingTime: inputProcess.burstTime }
      ]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateHRRN = (processes, currentTime) => {
    let localTime = currentTime;
    const n = processes.length;
    const completed = new Array(n).fill(false);
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    let completedProcesses = 0;

    while (completedProcesses < n) {
      let idx = -1;
      let maxRatio = -1;
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= localTime && !completed[i]) {
          let responseRatio = (localTime - processes[i].arrivalTime + processes[i].burstTime) / processes[i].burstTime;
          if (responseRatio > maxRatio) {
            maxRatio = responseRatio;
            idx = i;
          }
        }
      }
      if (idx === -1) {
        localTime++;
        continue;
      }
      waitingTime[idx] = localTime - processes[idx].arrivalTime;
      localTime += processes[idx].burstTime;
      turnaroundTime[idx] = localTime - processes[idx].arrivalTime;
      completed[idx] = true;
      completedProcesses++;
    }

    return processes.map((process, index) => ({
      ...process,
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index],
    }));
  };

  const processedList = processes.length > 0 ? calculateHRRN(processes, currentTime) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Highest Response Ratio Next Scheduling</h2>
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
      <div className="mb-4">
        <label htmlFor="currentTime" className="block text-gray-700 font-semibold mb-2">
          Current Time
        </label>
        <input
          type="number"
          id="currentTime"
          placeholder="Current Time"
          value={currentTime}
          onChange={(e) => setCurrentTime(Math.max(0, parseInt(e.target.value, 10)))}
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
      </div>
    </div>
  );
}

export default HRRN;
