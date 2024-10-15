"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const TopPositions = ({ positions }) => {
  return (
    <div className="flex justify-center space-x-14 mt-10 pb-14">
      {positions.map((position, index) => (
        <div key={index} className="flex flex-col items-center transition-transform transform hover:scale-105">
          <div className={`w-36 h-36 rounded-full ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'} flex items-center justify-center text-white text-5xl font-bold shadow-lg`}>
            {index + 1}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">{position.name.join(', ')}</h3>
          {/* <p className="text-sm text-gray-600">Score: {position.score}</p> */}
        </div>
      ))}
    </div>
  );
};

const TailwindInfo = () => {
  const [availableSchools, setAvailableSchools] = useState([]);
  const [topThreeParticipants, setTopThreeParticipants] = useState([]); // Initialize state for top three participants
  const [eventTitle, setEventTitle] = useState('');
  const params = useParams();
  const router = useRouter(); 
  const { eventdetails } = params;

  useEffect(() => {
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

        const selectedEvent = data.events.find(event => event._id === eventdetails);
        if (selectedEvent) {
          setEventTitle(selectedEvent.title);

          const filteredSchools = data.schools.filter(school => 
            school.eventsParticipated.some(event => event.eventName === selectedEvent.title)
          );

          const schoolsWithPoints = filteredSchools.map(school => {
            const totalPoints = school.eventsParticipated.reduce((acc, event) => acc + event.score, 0);
            return { ...school, totalPoints };
          });

          const sortedSchools = schoolsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);
          setAvailableSchools(sortedSchools);


          const res = await fetch('/api/participants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventTitle: selectedEvent.title }),
          })

          const data2 = await res.json()

          // // Fetch participants for the selected event
          const eventParticipants = data2.participants.filter(participant => participant.eventId === selectedEvent.title);

          console.log(eventParticipants)

          // Calculate top three participants
          const topParticipants = eventParticipants
            .map(participant => ({
              name: participant.names, // Adjust if you want to show more than one name 
              schoolId: participant.schoolId // Get the school ID
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Get top 3 participants

          // Fetch school names for top participants
          // const topParticipantsWithSchoolNames = await Promise.all(topParticipants.map(async (top) => {
          //   const school = await fetch(`/api/schools/${top.schoolId}`); // Replace with your school fetching logic
          //   const schoolData = await school.json();
          //   return { ...top, schoolName: schoolData.schoolName }; // Assuming the API returns the school name
          // }));

          setTopThreeParticipants(topParticipants);
        }

      } catch (error) {
        console.error('Error fetching schools or events:', error);
      }
    };

    fetchSchoolsAndEvents();
  }, [eventdetails]);

  const handleRowClick = (schoolCode) => {
    router.push(`/events/${eventdetails}/${schoolCode}/winners`);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Winners</h1>
        <TopPositions positions={topThreeParticipants} />
      </div>
      <div className="m-4 flex-col justify-center">
        <h1 className="text-3xl mb-5 font-extrabold leading-9 tracking-tight text-gray-900 dark:text-cyan-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {eventTitle ? `${eventTitle} Details` : 'Event Details'}
        </h1>

        <div className="h-[520px] md:h-[600px] w-full overflow-auto rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-blue-900 dark:bg-gray-800">
                <th className="px-4 py-4 text-center text-3xl font-medium text-white dark:text-white">Rank</th>
                <th className="px-4 py-4 text-center text-3xl font-medium text-white dark:text-white">School Code</th>
                <th className="px-4 py-4 text-center text-3xl font-medium text-white dark:text-white">School Name</th>
                <th className="px-4 py-4 text-center text-3xl font-medium text-white dark:text-white">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900 text-center">
              {availableSchools.length > 0 && availableSchools.map((item, index) => (
                <tr key={item.schoolCode} onClick={() => handleRowClick(item.schoolCode)}>
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{index + 1}</td>
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.schoolCode}</td>
                  <td className="px-4 py-4 text-2xl text-blue-900 font-bold dark:text-cyan-400 cursor-pointer hover:underline">{item.schoolName}</td>
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TailwindInfo;
