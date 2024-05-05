import React, { useState } from 'react';

function SRT() {
  const [inputProcess, setInputProcess] = useState({ arrivalTime: '', burstTime: '' });
  const [processes, setProcesses] = useState([]);
  const [processedList, setProcessedList] = useState([]);

  const addProcess = () => {
    if (inputProcess.burstTime > 0 && inputProcess.arrivalTime !== '') {
      const newProcess = {
        id: processes.length + 1,
        arrivalTime: parseInt(inputProcess.arrivalTime, 10),
        burstTime: parseInt(inputProcess.burstTime, 10),
        remainingTime: parseInt(inputProcess.burstTime, 10)
      };
      setProcesses(prev => [...prev, newProcess]);
      setInputProcess({ arrivalTime: '', burstTime: '' });
    }
  };

  const calculateSRT = () => {
    let time = 0;
    let completed = 0;
    let shortest = null;
    let finishTime;
    const n = processes.length;
    const waitingTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    const finishTimes = new Array(n).fill(0);
    const remainingTime = processes.map(process => process.burstTime);

    while (completed !== n) {
      // Find the process with the minimum remaining time at the current time
      shortest = null;
      let minRemainingTime = Infinity;
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= time && remainingTime[i] < minRemainingTime && remainingTime[i] > 0) {
          minRemainingTime = remainingTime[i];
          shortest = i;
        }
      }

      if (shortest === null) {
        time++;
        continue;
      }

      remainingTime[shortest]--;
      if (remainingTime[shortest] === 0) {
        completed++;
        finishTime = time + 1;
        finishTimes[shortest] = finishTime;
        waitingTime[shortest] = finishTime - processes[shortest].burstTime - processes[shortest].arrivalTime;
        waitingTime[shortest] = waitingTime[shortest] < 0 ? 0 : waitingTime[shortest];
      }
      time++;
    }

    for (let i = 0; i < n; i++) {
      turnaroundTime[i] = processes[i].burstTime + waitingTime[i];
    }

    return processes.map((process, index) => ({
      ...process,
      finishTime: finishTimes[index],
      waitingTime: waitingTime[index],
      turnaroundTime: turnaroundTime[index]
    }));
  };

  const handleCalculateSRT = () => {
    const result = calculateSRT();
    setProcessedList(result);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shortest Remaining Time First Scheduling</h2>
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
      <button onClick={handleCalculateSRT} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Start Scheduling
      </button>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processed Jobs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Arrival Time</th>
                <th className="px-4 py-2 border">Burst Time</th>
                <th className="px-4 py-2 border">Completion Time</th>
                <th className="px-4 py-2 border">Turnaround Time</th>
                <th className="px-4 py-2 border">Waiting Time</th>
              </tr>
            </thead>
            <tbody>
              {processedList.map((process, index) => (
                <tr key={index}>
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
    </div>
  );
}

export default SRT;
