"use client"
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

const TailwindInfo = () => {
  const [availableSchools, setAvailableSchools] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const params = useParams();
  const { eventdetails } = params;

  useEffect(() => {
    // Fetch schools and events
    const fetchSchoolsAndEvents = async () => {
      try {
        const response = await fetch('/api/getvalues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        // Find the event by ID (eventdetails)
        const selectedEvent = data.events.find(event => event._id === eventdetails);
        if (selectedEvent) {
          setEventTitle(selectedEvent.title); // Set the event name as title

          // Filter schools that participated in the selected event
          const filteredSchools = data.schools.filter(school => 
            school.eventsParticipated.some(event => event.eventName === selectedEvent.title)
          );

          // Calculate total points for each filtered school
          const schoolsWithPoints = filteredSchools.map(school => {
            const totalPoints = school.eventsParticipated.reduce((acc, event) => acc + event.score, 0);
            return { ...school, totalPoints }; // Add totalPoints field to each school
          });

          // Sort schools by total points in descending order
          const sortedSchools = schoolsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

          // Set state for available schools and events
          setAvailableSchools(sortedSchools);
        }

        setAvailableEvents(data.events); // Assuming data.events contains a list of events

      } catch (error) {
        console.error('Error fetching schools or events:', error);
      }
    };

    fetchSchoolsAndEvents();
  }, [eventdetails]);

  return (
    <div className="m-4 flex-col justify-center">
      <h1 className="text-3xl mb-5 font-extrabold leading-9 tracking-tight text-gray-900 dark:text-cyan-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        {eventTitle ? ` ${eventTitle} Details` : 'Event Details'}
      </h1>

      <div className="h-[600px] w-full overflow-auto rounded-lg border border-gray-300  dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-blue-900 dark:bg-gray-800">
              <th className="px-4 py-4 text-left text-3xl font-medium text-white dark:text-white">
                Rank
              </th>
              <th className="px-4 py-4 text-left text-3xl font-medium text-white dark:text-white">
                School Code
              </th>
              <th className="px-4 py-4 text-left text-3xl font-medium text-white dark:text-white">
                School Name
              </th>
              <th className="px-4 py-4 text-left text-3xl font-medium text-white dark:text-white">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {availableSchools.length > 0 && availableSchools.map((item, index) => (
              <tr key={item.schoolCode}>
                <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">
                  {item.schoolCode}
                </td>
                <td className="px-4 py-4 text-2xl text-blue-900 font-bold dark:text-cyan-400">
                  {item.schoolName}
                </td>
                <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">
                  {item.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TailwindInfo;
