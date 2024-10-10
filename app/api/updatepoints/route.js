import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { School } from "../../../models/schoolSchema";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Destructure request body
    const { selectedSchool, category, event, points, schoolCode } = await request.json();

    // Find the school by its code
    const school = await School.findOne({ schoolCode });
    if (!school) {
      return NextResponse.json({ message: "School not found", status: 404 });
    }

    // Check if the event already exists for this school
    const existingEventIndex = school.eventsParticipated.findIndex(
      (e) => e.eventName === event && e.category === category
    );

    if (existingEventIndex !== -1) {
      // Update the score if the event already exists
      school.eventsParticipated[existingEventIndex].score = points;
    } else {
      // Add a new event if it doesn't exist
      school.eventsParticipated.push({
        eventName: event,
        score: points,
        category: category,
      });
    }

    // Save the updated school document
    await school.save();

    return NextResponse.json({ message: "School points updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error", status: 500 });
  }
}
