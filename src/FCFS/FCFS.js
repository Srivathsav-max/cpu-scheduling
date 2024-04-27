import React, { useState } from 'react';

function FCFS() {
  const [processes, setProcesses] = useState([]);
  const [inputProcess, setInputProcess] = useState({
    arrivalTime: '',
    burstTime: '',
  });

  const addProcess = () => {
    if (inputProcess.burstTime > 0 && inputProcess.arrivalTime >= 0) {
      setProcesses([
        ...processes,
        {
          ...inputProcess,
          id: processes.length + 1,
          arrivalTime: parseInt(inputProcess.arrivalTime),
          burstTime: parseInt(inputProcess.burstTime),
        },
      ]);
      setInputProcess({
        arrivalTime: '',
        burstTime: '',
      });
    }
  };

  const calculateFCFS = (processList) => {
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let lastCompletionTime = 0;

    const processesWithDetails = processList.sort((a, b) => a.arrivalTime - b.arrivalTime).map((process) => {
      const waitingTime = Math.max(currentTime - process.arrivalTime, 0);
      const turnaroundTime = waitingTime + process.burstTime;
      currentTime = Math.max(currentTime, process.arrivalTime) + process.burstTime;
      lastCompletionTime = currentTime;

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;

      return { ...process, waitingTime, turnaroundTime, finishTime: currentTime };
    });

    const totalTimeTaken = lastCompletionTime;
    const throughput = processList.length / totalTimeTaken;

    return {
      processes: processesWithDetails,
      averageWaitingTime: totalWaitingTime / processList.length,
      averageTurnaroundTime: totalTurnaroundTime / processList.length,
      throughput,
    };
  };

  const {
    processes: processedList,
    averageWaitingTime,
    averageTurnaroundTime,
    throughput,
  } = calculateFCFS(processes);

  const renderGanttChart = () => {
    const ganttChart = [];
    let currentTime = 0;

    processedList.forEach((process) => {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const endTime = startTime + process.burstTime;

      ganttChart.push(
        <div key={process.id} className="flex items-center">
          <div className="w-4 h-6 bg-gray-200 mr-2"></div>
          <span className="font-semibold">{process.id}</span>
          <div className="bg-blue-500 h-6 ml-2" style={{ width: `${(endTime - startTime) * 20}px` }}></div>
          <span className="ml-2">{startTime} - {endTime}</span>
        </div>
      );

      currentTime = endTime;
    });

    return ganttChart;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">First Come First Serve Scheduling</h2>
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
        <div className="flex items-center">
          {renderGanttChart()}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processes</h3>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Job</th>
              <th className="px-4 py-2 border">Arrival Time</th>
              <th className="px-4 py-2 border">Burst Time</th>
              <th className="px-4 py-2 border">Completion Time</th>
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
          <tfoot className="bg-gray-200">
            <tr>
              <td colSpan={3} className="px-4 py-2 border font-semibold text-right">Average</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border">{averageTurnaroundTime.toFixed(2)}</td>
              <td className="px-4 py-2 border">{averageWaitingTime.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            Throughput: {throughput.toFixed(2)} processes/unit time
          </div>
        </div>
      </div>
    </div>
  );
}

export default FCFS;