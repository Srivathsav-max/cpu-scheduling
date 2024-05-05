import React, { useState } from 'react';

function RR() {
  const [inputProcess, setInputProcess] = useState({ arrivalTime: '', burstTime: '' });
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState(3); // Default quantum can be set dynamically
  const [processedList, setProcessedList] = useState([]);

  const addProcess = () => {
    setProcesses(prevProcesses => [
      ...prevProcesses, 
      { 
        id: prevProcesses.length + 1,
        arrivalTime: parseInt(inputProcess.arrivalTime, 10),
        burstTime: parseInt(inputProcess.burstTime, 10),
        remainingTime: parseInt(inputProcess.burstTime, 10)
      }
    ]);
    setInputProcess({ arrivalTime: '', burstTime: '' }); // Reset inputs
  };

  const runRoundRobin = () => {
    let time = 0;
    let queue = [];
    let finishedProcesses = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    // Initialize the queue with processes that are ready at time 0
    while (processes.length > 0 && processes[0].arrivalTime <= time) {
      queue.push(processes.shift());
    }

    while (queue.length > 0 || processes.length > 0) {
      if (queue.length === 0) {
        // If the queue is empty, jump time to the next process's arrival
        time = processes[0].arrivalTime;
        queue.push(processes.shift());
      }

      let process = queue.shift();
      let timeSpent = Math.min(process.remainingTime, quantum);
      process.remainingTime -= timeSpent;
      time += timeSpent;

      // Check for new arrivals during the current process's execution
      while (processes.length > 0 && processes[0].arrivalTime <= time) {
        queue.push(processes.shift());
      }

      if (process.remainingTime > 0) {
        queue.push(process);  // Re-queue the process if it's not finished
      } else {
        finishedProcesses.push({
          ...process,
          finishTime: time,
          turnaroundTime: time - process.arrivalTime,
          waitingTime: time - process.arrivalTime - process.burstTime
        });
      }
    }
  
    setProcessedList(finishedProcesses.sort((a, b) => a.id - b.id));
  };  

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Round Robin Scheduling</h2>
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
      <button onClick={addProcess} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Process
      </button>
      <button onClick={runRoundRobin} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
        Start Scheduling
      </button>
      <div className="mt-6">
        <label htmlFor="quantumTime" className="block text-gray-700 font-semibold mb-2">Time Quantum</label>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processed Jobs</h3>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Job</th>
              <th className="px-4 py-2 border">Arrival Time</th>
              <th className="px-4 py-2 border">Burst Time</th>
              <th className="px-4 py-2 border">Finish Time</th>
              <th className="px-4 py-2 border">Turnaround Time</th>
              <th className="px-4 py-2 border">Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {processedList.map((process, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border">{process.id}</td>
                <td className="px-4 py-2 border">{process.arrivalTime}</td>
                <td className="px-4 py-2 border">{process.burstTime}</td>
                <td className="px-4 py-2 border">{process.finishTime}</td>
                <td className="px-4 py-2 border">{process.turnaroundTime}</td>
                <td className="px-4 py-2 border">{process.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RR;
