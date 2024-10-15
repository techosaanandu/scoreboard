"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

// const TopPositions = ({ positions }) => {
//   return (
//     <div className="flex justify-center space-x-14 mt-10 pb-14">
//       {positions.map((position, index) => (
//         <div key={index} className="flex flex-col items-center transition-transform transform hover:scale-105">
//           <div className={`w-36 h-36 rounded-full ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'} flex items-center justify-center text-white text-5xl font-bold shadow-lg`}>
//             {index + 1}
//           </div>
//           <h3 className="mt-4 text-lg font-semibold text-gray-800">{position.name}</h3>
//           {/* <p className="text-sm text-gray-600">Score: {position.score}</p> */}
//         </div>
//       ))}
//     </div>
//   );
// };

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
    
          // Get the filtered schools participating in the selected event
          const filteredSchools = data.schools.filter(school => 
            school.eventsParticipated.some(event => event.eventName === selectedEvent.title)
          );

          //       const schoolsWithPoints = filteredSchools.map(school => {
          //   const totalPoints = school.eventsParticipated.reduce((acc, event) => acc + event.score, 0);
          //   return { ...school, totalPoints };
          // });

          const schoolsWithPoints = filteredSchools.map(school => {
            const totalPoints = school.eventsParticipated.reduce((acc, event) => {
              // Only count points for the selected event
              return event.eventName === selectedEvent.title ? acc + event.score : acc;
            }, 0);
            return { ...school, totalPoints };
          });

          const sortedSchools = schoolsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);
          setAvailableSchools(sortedSchools);
          console.log(sortedSchools)
    
          // Create a mapping of schoolId to total score
          const schoolScoresMap = {};
          filteredSchools.forEach(school => {
            school.eventsParticipated.forEach(event => {
              if (event.eventName === selectedEvent.title) {
                if (!schoolScoresMap[school._id]) {
                  schoolScoresMap[school._id] = {
                    totalPoints: 0,
                    schoolName: school.schoolName
                  };
                }
                schoolScoresMap[school._id].totalPoints += event.score;
              }
            });
          });
    
          // Get all participants for the selected event
          const res = await fetch('/api/participants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventTitle: selectedEvent.title }),
          });
    
          const data2 = await res.json();
    
          const eventParticipants = data2.participants.filter(participant => participant.eventId === selectedEvent.title);
    
          // Calculate top three participants based on the scores from schoolScoresMap
          const topParticipants = eventParticipants
            .map(participant => ({
              name: participant.names.join(', '), // Join names if there are multiple
              schoolId: participant.schoolId,
              totalPoints: schoolScoresMap[participant.schoolId]?.totalPoints || 0 // Get the score from the map
            }))
            .sort((a, b) => b.totalPoints - a.totalPoints) // Sort by totalPoints
            .slice(0, 3); // Get top 3 participants
    
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
      {/* <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Winners</h1>
        <TopPositions positions={topThreeParticipants} />
      </div> */}
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
                <th className="px-4 py-4 text-center text-3xl font-medium text-white dark:text-white">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900 text-center">
              {availableSchools.length > 0 && availableSchools.map((item, index) => {
                const participatedEvent = item.eventsParticipated.find(event => event.eventName === eventTitle);
                return(
                <tr key={item.schoolCode} >
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{index + 1}</td>
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.schoolCode}</td>
                  <td onClick={() => handleRowClick(item.schoolCode)} className="px-4 py-4 text-2xl text-blue-900 font-bold dark:text-cyan-400 cursor-pointer hover:underline">{item.schoolName}</td>
                  <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.totalPoints}</td>
                  <td onClick={() => router.push(`/events/${eventdetails}/${item.schoolCode}/winners/${participatedEvent.category}`)} className="px-4 cursor-pointer hover:underline py-4 text-2xl text-gray-900 dark:text-gray-100">{participatedEvent ? participatedEvent.category:""}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TailwindInfo;
