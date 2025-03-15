"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [recentlyUncompleted, setRecentlyUncompleted] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  // Debug state to show what's happening
  const [debugMessage, setDebugMessage] = useState<string>("");

  // Calculate total points
  const calculateTotalPoints = useCallback(() => {
    let points = 0;

    Object.keys(completedTasks).forEach(day => {
      Object.keys(completedTasks[day]).forEach(taskId => {
        if (completedTasks[day][taskId]) {
          points += 1;
        }
      });
    });

    setTotalPoints(points);
  }, [completedTasks]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("rewardChartData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCompletedTasks(parsedData.completedTasks || {});
        setTotalPoints(parsedData.totalPoints || 0);

        // Don't show instructions if they've already used the app
        if (Object.keys(parsedData.completedTasks || {}).length > 0) {
          setShowInstructions(false);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Calculate total points whenever completedTasks changes
  useEffect(() => {
    calculateTotalPoints();
  }, [calculateTotalPoints]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rewardChartData", JSON.stringify({
      completedTasks,
      totalPoints
    }));
  }, [completedTasks, totalPoints]);

  // Toggle task completion - Fixed version
  const toggleTask = (taskId: string, day: string) => {
    const taskKey = `${taskId}-${day}`;

    setCompletedTasks(prev => {
      // Create a deep copy of the previous state
      const newCompletedTasks = JSON.parse(JSON.stringify(prev));

      // Initialize the day if it doesn't exist
      if (!newCompletedTasks[day]) {
        newCompletedTasks[day] = {};
      }

      // Get the current value (or false if not set)
      const currentValue = newCompletedTasks[day][taskId] || false;

      // Toggle the task completion
      newCompletedTasks[day][taskId] = !currentValue;

      // For debugging
      setDebugMessage(`Task ${taskId} for ${day} was ${currentValue ? "completed" : "not completed"}, now set to ${!currentValue ? "completed" : "not completed"}`);

      return newCompletedTasks;
    });

    // Set animation state
    setTimeout(() => {
      // Check the current state after the state update
      const isNowCompleted = completedTasks[day]?.[taskId];

      if (isNowCompleted) {
        setRecentlyCompleted(taskKey);
        setRecentlyUncompleted(null);
      } else {
        setRecentlyUncompleted(taskKey);
        setRecentlyCompleted(null);
      }

      // Clear animations after a delay
      setTimeout(() => {
        setRecentlyCompleted(null);
        setRecentlyUncompleted(null);
      }, 400);
    }, 0);

    // Hide instructions after first interaction
    if (showInstructions) {
      setShowInstructions(false);
    }
  };

  // Reset all data
  const resetData = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      setCompletedTasks({});
      setTotalPoints(0);
      setDebugMessage("All data has been reset");
    }
  };

  // Count completed tasks for a specific day
  const countCompletedTasksForDay = (day: string) => {
    if (!completedTasks[day]) return 0;
    return Object.values(completedTasks[day]).filter(Boolean).length;
  };

  // Check if a task is completed
  const isTaskCompleted = (day: string, taskId: string) => {
    return completedTasks[day]?.[taskId] === true;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-200 to-purple-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-purple-800 drop-shadow-sm">Andrea&apos;s Reward Chart</h1>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 mb-6 shadow-md">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">How to use:</h3>
            <ul className="list-disc pl-5 text-yellow-800">
              <li>Click on any circle to mark a task as completed</li>
              <li>Click again to undo if you made a mistake</li>
              <li>You can select multiple tasks for each day</li>
              <li>Your progress is saved automatically</li>
            </ul>
          </div>
        )}

        {/* Debug Message - Only visible during development */}
        {debugMessage && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 mb-4 text-sm text-gray-700">
            Debug: {debugMessage}
          </div>
        )}

        {/* Current Points Display */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border-2 border-purple-300">
          <h2 className="text-2xl font-semibold text-center mb-2 text-purple-900">
            Current Points: <span className="text-3xl text-green-600 font-bold">{totalPoints}</span>
          </h2>

          {/* Reward Levels */}
          <div className="mt-4">
            <h3 className="text-xl font-medium mb-3 text-purple-800">Rewards:</h3>
            <ul className="space-y-3 pl-2">
              {REWARD_POINTS.map((reward, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    totalPoints >= reward.points
                      ? 'bg-green-200 text-green-900 font-bold shadow-sm'
                      : 'text-gray-900 bg-gray-100'
                  }`}
                >
                  {totalPoints >= reward.points && <span className="text-xl mr-2">✅</span>}
                  {reward.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reward Chart Table */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-purple-300 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-2 border-purple-300 p-4 bg-purple-200 text-purple-900 font-bold text-lg w-1/4"></th>
                {DAYS.map(day => (
                  <th key={day} className="border-2 border-purple-300 p-4 bg-purple-200 text-purple-900 font-bold text-lg text-center">
                    {day}
                    {countCompletedTasksForDay(day) > 0 && (
                      <div className="text-sm mt-1 font-normal">
                        {countCompletedTasksForDay(day)} task{countCompletedTasksForDay(day) !== 1 ? 's' : ''} done
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task, taskIndex) => (
                <tr key={task.id} className={taskIndex % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                  <td className="border-2 border-purple-300 p-4 font-medium text-lg text-gray-900">{task.label}</td>
                  {DAYS.map(day => {
                    const taskKey = `${task.id}-${day}`;
                    const isCompleted = isTaskCompleted(day, task.id);
                    const isRecentlyCompleted = recentlyCompleted === taskKey;
                    const isRecentlyUncompleted = recentlyUncompleted === taskKey;

                    return (
                      <td
                        key={taskKey}
                        className={`border-2 border-purple-300 p-4 text-center cursor-pointer transition-colors ${
                          isCompleted ? 'bg-green-50' : 'hover:bg-blue-200'
                        }`}
                        onClick={() => toggleTask(task.id, day)}
                        title={isCompleted ? "Click to unmark this task" : "Click to mark this task as completed"}
                      >
                        {isCompleted ? (
                          <span className={`text-4xl text-green-600 ${isRecentlyCompleted ? 'completed-task' : ''}`}>✓</span>
                        ) : (
                          <span className={`text-3xl text-gray-400 hover:text-gray-600 ${isRecentlyUncompleted ? 'uncompleted-task' : ''}`}>○</span>
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
            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Reset Chart
          </button>
        </div>
      </div>
    </div>
  );
}
