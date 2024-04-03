import React, { useState } from 'react';

function RR() {
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState(1); // Default quantum value
  const [inputProcess, setInputProcess] = useState({ id: 1, arrivalTime: 0, burstTime: 0 });

  const addProcess = () => {
    if (inputProcess.burstTime > 0 && inputProcess.arrivalTime >= 0) {
      setProcesses([...processes, { ...inputProcess, id: processes.length + 1, remainingTime: inputProcess.burstTime }]);
      setInputProcess({ id: processes.length + 2, arrivalTime: 0, burstTime: 0 });
    }
  };

  const calculateRR = (processes, quantum) => {
    let time = 0;
    const n = processes.length;
    const remainingTime = [...processes].map(process => process.burstTime);
    const waitingTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);

    let queue = processes.map((process, index) => ({ ...process, index }));

    while (queue.length > 0) {
      const process = queue.shift();
      const execTime = Math.min(process.remainingTime, quantum);

      // Increase time and decrease remaining time
      time += execTime;
      process.remainingTime -= execTime;

      // For all other processes in the queue, increase their waiting time
      queue.forEach(p => {
        if (p.id !== process.id) {
          waitingTime[p.index] += execTime;
        }
      });

      // If process is not finished, push it back to the queue
      if (process.remainingTime > 0) {
        queue.push(process);
      } else {
        completionTime[process.index] = time;
      }
    }

    const turnaroundTime = completionTime.map((cTime, index) => cTime - processes[index].arrivalTime);
    
    return processes.map((process, index) => ({
      ...process,
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index],
    }));
  };

  const processedList = calculateRR(processes, quantum);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Round Robin Scheduling</h2>
      <div className="mb-4">
        <label htmlFor="arrivalTime" className="block text-gray-700 font-semibold mb-2">Arrival Time</label>
        <input
          type="number"
          id="arrivalTime"
          placeholder="Arrival Time"
          value={inputProcess.arrivalTime}
          onChange={(e) => setInputProcess({ ...inputProcess, arrivalTime: e.target.value })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="burstTime" className="block text-gray-700 font-semibold mb-2">Burst Time</label>
        <input
          type="number"
          id="burstTime"
          placeholder="Burst Time"
          value={inputProcess.burstTime}
          onChange={(e) => setInputProcess({ ...inputProcess, burstTime: e.target.value })}
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
        <label htmlFor="quantumTime" className="block text-gray-700 font-semibold mb-2">Quantum Time</label>
        <input
          type="number"
          id="quantumTime"
          placeholder="Quantum Time"
          value={quantum}
          onChange={(e) => setQuantum(parseInt(e.target.value, 10))}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
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

export default RR;
