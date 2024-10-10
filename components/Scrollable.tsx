"use client"
import { useEffect, useState } from "react";

const TailwindInfo = () => {
    const [availableSchools, setAvailableSchools] = useState([]);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch('/api/getvalues', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
                const data = await response.json();

                // Calculate total points for each school based on eventsParticipated
                const schoolsWithPoints = data.schools.map(school => {
                    const totalPoints = school.eventsParticipated.reduce((acc, event) => acc + event.score, 0);
                    return { ...school, totalPoints }; // Add totalPoints field to each school
                });

                // Sort schools by total points in descending order
                const sortedSchools = schoolsWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

                setAvailableSchools(sortedSchools);
            } catch (error) {
                console.error('Error fetching schools:', error);
            }
        };

        fetchSchools();
    }, []);

    return (
        <div className="h-[500px] w-full m-2 overflow-auto rounded-lg border border-gray-300 dark:border-gray-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                    <tr className="bg-blue-900 dark:bg-gray-800">
                        <th className="px-4 py-4 text-left text-3xl font-bold text-white dark:text-white">Rank</th>
                        <th className="px-4 py-4 text-left text-3xl font-bold text-white dark:text-white">School Code</th>
                        <th className="px-4 py-4 text-left text-3xl font-bold text-white dark:text-white">School Name</th>
                        <th className="px-4 py-4 text-left text-3xl font-bold text-white dark:text-white">Total Points</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-600">
                    {availableSchools.length > 0 && availableSchools.map((item, index) => (
                        <tr key={item.schoolCode}>
                            <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{index + 1}</td>
                            <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.schoolCode}</td>
                            <td className="px-4 font-bold py-4 text-2xl text-blue-900 dark:text-cyan-400">{item.schoolName}</td>
                            <td className="px-4 py-4 text-2xl text-gray-900 dark:text-gray-100">{item.totalPoints}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TailwindInfo;
