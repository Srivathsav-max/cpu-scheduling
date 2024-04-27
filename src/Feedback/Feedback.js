import React, { useState } from 'react';

function Feedback() {
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState([4, 8]); // Quantum for the first two queues
  const [inputProcess, setInputProcess] = useState({ arrivalTime: '', burstTime: '' });

  const addProcess = () => {
    if (inputProcess.burstTime > 0 && inputProcess.arrivalTime >= 0) {
      setProcesses(prevProcesses => [
        ...prevProcesses,
        {
          id: prevProcesses.length + 1,
          arrivalTime: parseInt(inputProcess.arrivalTime, 10),
          burstTime: parseInt(inputProcess.burstTime, 10),
          remainingTime: parseInt(inputProcess.burstTime, 10),
        },
      ]);
      setInputProcess({ arrivalTime: '', burstTime: '' });
    }
  };

  const calculateMLFQ = (processes) => {
    let time = 0;
    const n = processes.length;
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);

    // Define queues for different levels
    let queues = [processes.map((process, index) => ({
      ...process,
      index,
      queueLevel: 0,
    }))];
    
    let ganttChart = [];

    while (queues.some(queue => queue.length > 0)) {
      queues.forEach((queue, level) => {
        if (queue.length === 0) return;
        
        let quantumTime = level < quantum.length ? quantum[level] : Infinity;  // FCFS for the last level
        let processIndex = 0;
        let process = queue[processIndex];
        const execTime = Math.min(process.remainingTime, quantumTime);

        // Increase time and decrease remaining time
        time += execTime;
        process.remainingTime -= execTime;

        // Add to Gantt chart
        ganttChart.push({ id: process.id, start: time - execTime, end: time });

        // For all other processes in the queue, increase their waiting time
        queue.forEach((p, idx) => {
          if (idx !== processIndex) {
            waitingTime[p.index] += execTime;
          }
        });

        // Manage process completion or escalation
        if (process.remainingTime > 0) {
          if (level + 1 < queues.length) {
            queues[level + 1].push({...process, queueLevel: level + 1});
          } else {
            queue.push({...process});
          }
        } else {
          completionTime[process.index] = time;
          turnaroundTime[process.index] = time - process.arrivalTime;
        }
        queue.splice(processIndex, 1);
      });
    }

    return { processes, waitingTime, turnaroundTime, completionTime, ganttChart };
  };

  const { processes: processedList, waitingTime, turnaroundTime, completionTime, ganttChart } = calculateMLFQ(processes);

  const renderGanttChart = () => {
    const chartWidth = ganttChart.reduce((max, item) => Math.max(max, item.end), 0) * 20;
    return (
      <div className="flex items-center overflow-auto">
        {ganttChart.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="bg-blue-500 h-6 ml-2"
              style={{ width: `${(item.end - item.start) * 20}px` }}
            >
              {item.id} ({item.start} - {item.end})
            </div>
          </React.Fragment>
        ))}
        <div className="w-full bg-gray-200 h-1 mt-2" style={{ width: `${chartWidth}px` }}></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Multi-Level Feedback Queue Scheduling</h2>
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
                <td className="px-4 py-2 border">{process.arrivalTime}</td
                ><td className="px-4 py-2 border">{process.burstTime}</td>
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

export default Feedback;
