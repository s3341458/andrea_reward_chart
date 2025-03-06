"use client";

import { useState, useEffect } from "react";

// Define the task types based on the reward chart
const TASKS = [
  { id: "total-goal", label: "Total Goal" },
  { id: "finish-homework", label: "Finish Homework (reading and writing)" },
  { id: "toilet-4-times", label: "Toilet 4 Times" },
  { id: "talk-no-only-cry", label: "Talk, No Only Cry" },
  { id: "tv-less-than-30-mins", label: "TV Less Than 30 Mins" },
  { id: "running", label: "Running" },
  { id: "other-sports", label: "Other Sports 🏀" },
  { id: "eat-vege", label: "Eat Vege 🥦" },
  { id: "go-to-bed-at-8pm", label: "Go To Bed At 8PM" }
];

// Define the days of the week
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Define the reward points
const REWARD_POINTS = [
  { points: 7, label: "7 Points: ⭐ Extra Bedtime or TV time (20 minutes)" },
  { points: 25, label: "25 Points: 🎮 Robox Time and Ice cream" },
  { points: 40, label: "40 Points: 🎁 Pick Up Your Gift (A toy) or treat under $20" },
  { points: 45, label: "45 Points: 🎁 Pick Up Your Gift (A toy) or treat under $20" }
];

export default function Home() {
  // State to track completed tasks
  const [completedTasks, setCompletedTasks] = useState<Record<string, Record<string, boolean>>>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("rewardChartData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCompletedTasks(parsedData.completedTasks || {});
        setTotalPoints(parsedData.totalPoints || 0);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Calculate total points whenever completedTasks changes
  useEffect(() => {
    calculateTotalPoints();
  }, [completedTasks]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rewardChartData", JSON.stringify({
      completedTasks,
      totalPoints
    }));
  }, [completedTasks, totalPoints]);

  // Toggle task completion
  const toggleTask = (taskId: string, day: string) => {
    const taskKey = `${taskId}-${day}`;

    setCompletedTasks(prev => {
      const newCompletedTasks = { ...prev };

      // Initialize the day if it doesn't exist
      if (!newCompletedTasks[day]) {
        newCompletedTasks[day] = {};
      }

      // Toggle the task completion
      newCompletedTasks[day][taskId] = !newCompletedTasks[day][taskId];

      return newCompletedTasks;
    });

    // Set recently completed for animation
    setRecentlyCompleted(taskKey);
    setTimeout(() => setRecentlyCompleted(null), 300);
  };

  // Calculate total points
  const calculateTotalPoints = () => {
    let points = 0;

    Object.keys(completedTasks).forEach(day => {
      Object.keys(completedTasks[day]).forEach(taskId => {
        if (completedTasks[day][taskId]) {
          points += 1;
        }
      });
    });

    setTotalPoints(points);
  };

  // Reset all data
  const resetData = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      setCompletedTasks({});
      setTotalPoints(0);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Andrea's Reward Chart</h1>

        {/* Current Points Display */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-center">
            Current Points: <span className="text-2xl text-green-600">{totalPoints}</span>
          </h2>

          {/* Reward Levels */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Rewards:</h3>
            <ul className="space-y-2">
              {REWARD_POINTS.map((reward, index) => (
                <li
                  key={index}
                  className={`${totalPoints >= reward.points ? 'text-green-600 font-bold' : 'text-gray-600'}`}
                >
                  {reward.label}
                  {totalPoints >= reward.points && " ✅"}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reward Chart Table */}
        <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100"></th>
                {DAYS.map(day => (
                  <th key={day} className="border p-2 bg-gray-100 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map(task => (
                <tr key={task.id}>
                  <td className="border p-2 font-medium">{task.label}</td>
                  {DAYS.map(day => {
                    const taskKey = `${task.id}-${day}`;
                    const isCompleted = completedTasks[day]?.[task.id];
                    const isRecentlyCompleted = recentlyCompleted === taskKey;

                    return (
                      <td
                        key={taskKey}
                        className="border p-2 text-center cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleTask(task.id, day)}
                      >
                        {isCompleted ? (
                          <span className={`text-2xl text-green-500 ${isRecentlyCompleted ? 'completed-task' : ''}`}>✓</span>
                        ) : (
                          <span className="text-gray-300">○</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reset Button */}
        <div className="mt-6 text-center">
          <button
            onClick={resetData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Reset Chart
          </button>
        </div>
      </div>
    </div>
  );
}
