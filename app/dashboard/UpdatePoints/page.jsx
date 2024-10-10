"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UpdatePointsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [availableSchools, setAvailableSchools] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [points, setPoints] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [category, setCategory] = useState("");
  const [event, setEvent] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/getvalues", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
   
        setAvailableSchools(data?.schools);
        setAvailableEvents(data?.events);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const handleSchoolChange = (e) => {
    const selected = e.target.value;
    setSelectedSchool(selected);

    // Find the selected school object from availableSchools and set its schoolCode
    const selectedSchoolObj = availableSchools.find(
      (school) => school.schoolName === selected
    );
    setSchoolCode(selectedSchoolObj?.schoolCode || ""); // Set schoolCode or empty string if not found
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchool || !category || !event || !points || !schoolCode) {
      return;
    }
    try {
      const response = await fetch("/api/updatepoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedSchool,
          category,
          event,
          points,
          schoolCode,
        }),
      });
      const data = await response.json();
      if(data.message=== "School points updated successfully" ){
        toast.success("Points Udated")
      }
      else{
        toast.error("Something Went Wrong")
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Points</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="event"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Event
          </label>
          <select
            id="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select an Event</option>
            {availableEvents.length > 0 &&
              availableEvents.map((event, index) => (
                <option key={index} value={event.title}>
                  {event.title}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="school"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select School
          </label>
          <select
            id="school"
            value={selectedSchool}
            onChange={handleSchoolChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a school</option>
            {availableSchools.length > 0 &&
              availableSchools.map((school, index) => (
                <option key={index} value={school.schoolName}>
                  {school.schoolName}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="schoolcode"
            className="block text-gray-700 font-semibold mb-2"
          >
            School Code
          </label>
          <input
            type="text"
            id="schoolcode"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="School Code"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a Category</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
            <option value="Category 3">Category 3</option>
            <option value="Category 1">Category 4</option>
            <option value="Category 2">Category 5</option>
            <option value="Category 3">Category 6</option>
            <option value="Category 1">Category 7</option>
            <option value="Category 2">Category 8</option>
            <option value="Category 3">Category 9</option>
            <option value="Category 3">Category 10</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="points"
            className="block text-gray-700 font-semibold mb-2"
          >
            Enter Points
          </label>
          <input
            type="number"
            id="points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter points"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full"
        >
          Update Points
        </button>
      </form>
    </div>
  );
};

export default UpdatePointsPage;
