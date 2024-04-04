import React, { useState } from 'react';

function RR() {
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState(''); // Default quantum value
  const [inputProcess, setInputProcess] = useState({ arrivalTime: '', burstTime: '' });

  const addProcess = () => {
    if (inputProcess.burstTime > 0 && inputProcess.arrivalTime >= 0) {
      setProcesses([
        ...processes,
        {
          id: processes.length + 1,
          arrivalTime: parseInt(inputProcess.arrivalTime),
          burstTime: parseInt(inputProcess.burstTime),
          remainingTime: parseInt(inputProcess.burstTime),
        },
      ]);
      setInputProcess({ arrivalTime: '', burstTime: '' });
    }
  };

  const calculateRR = (processes, quantum) => {
    let time = 0;
    const n = processes.length;
    const remainingTime = [...processes].map(process => process.burstTime);
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);

    let queue = processes.map((process, index) => ({ ...process, index }));
    let ganttChart = [];

    while (queue.length > 0) {
      const process = queue.shift();
      const execTime = Math.min(process.remainingTime, quantum);

      // Increase time and decrease remaining time
      time += execTime;
      process.remainingTime -= execTime;

      // Add to Gantt chart
      ganttChart.push({ id: process.id, start: time - execTime, end: time });

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
        turnaroundTime[process.index] = time - process.arrivalTime;
      }
    }

    return { processes, waitingTime, turnaroundTime, completionTime, ganttChart };
  };

  const { processes: processedList, waitingTime, turnaroundTime, completionTime, ganttChart } = calculateRR(processes, quantum);

  const renderGanttChart = () => {
    const chartWidth = ganttChart.reduce((max, item) => Math.max(max, item.end), 0) * 20;
    return (
      <div className="flex items-center">
        {ganttChart.map((item, index) => (
          <React.Fragment key={index}>
            <div className="w-4 h-6 bg-gray-200 mr-2"></div>
            <span className="font-semibold">{item.id}</span>
            <div
              className="bg-blue-500 h-6 ml-2"
              style={{ width: `${(item.end - item.start) * 20}px` }}
            ></div>
            <span className="ml-2">{item.start} - {item.end}</span>
          </React.Fragment>
        ))}
        <div className="w-full bg-gray-200 h-1 mt-2"></div>
      </div>
    );
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
      <button
        onClick={addProcess}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Process
      </button>
      <div className="mt-6">
        <label htmlFor="quantumTime" className="block text-gray-700 font-semibold mb-2">
          Time Quantum
        </label>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gantt Chart</h3>
        {renderGanttChart()}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processes</h3>
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
                <td className="px-4 py-2 border">{completionTime[index]}</td>
                <td className="px-4 py-2 border">{turnaroundTime[index]}</td>
                <td className="px-4 py-2 border">{waitingTime[index]}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-200">
            <tr>
              <td colSpan={3} className="px-4 py-2 border font-semibold text-right">
                Average
              </td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border">
                {(turnaroundTime.reduce((sum, value) => sum + value, 0) / turnaroundTime.length).toFixed(2)}
              </td>
              <td className="px-4 py-2 border">
                {(waitingTime.reduce((sum, value) => sum + value, 0) / waitingTime.length).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
  );
}

export default RR;
