import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { GoogleGenAI } from '@google/genai';
import { parseMarkdownToJson } from '../lib/utils';
import TripModel, { TripDocument } from '../models/TripModel';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

//change user role
export const changeUserRole = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['admin', 'user'].includes(status)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, updatedUser, message: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

//create trip
export const createTrip = async (req: Request, res: Response): Promise<any> => {
  try {
    const { country, duration, travelStyle, interests, budget, groupType } =
      req.body;
    const userId = req.userId;

    console.log(userId);

    const prompt = `
You are an AI travel assistant. Based on the user preferences below, generate a travel itinerary in raw JSON (no markdown, no comments, no formatting, just pure JSON).

### User Preferences
- Country: ${country}
- Duration (in days): ${duration}
- Travel Style: ${travelStyle}
- Interests: ${interests}
- Budget: ${budget}
- Group Type: ${groupType}

### Output Format
Respond with a **pure JSON** object matching the following format exactly. DO NOT include explanations or markdown:

{
  "title": "Trip title",
  "description": "Brief summary of trip highlights (max 100 words)",
  "estimatedPrice": "1234",
  "duration": ${duration},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": "${interests}",
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Spring (Mar–May): Beautiful blossoms and mild temperatures",
    "☀️ Summer (Jun–Aug): Best for beaches and festivals",
    "🍁 Autumn (Sep–Nov): Scenic foliage and fewer crowds",
    "❄️ Winter (Dec–Feb): Snowy adventures and cozy vibes"
  ],
  "weatherInfo": [
    "☀️ Summer: 25–35°C (77–95°F)",
    "🌦️ Autumn: 15–25°C (59–77°F)",
    "🌧️ Spring: 10–20°C (50–68°F)",
    "❄️ Winter: 0–10°C (32–50°F)"
  ],
  "location": {
    "city": "City or region",
    "coordinates": [latitude, longitude],
    "openStreetMap": "https://openstreetmap.org/..."
  },
  "itinerary": [
    {
      "day": 1,
      "location": "City Name",
      "activities": [
        { "time": "Morning", "description": "🏰 Visit historic site" },
        { "time": "Afternoon", "description": "🖼️ Explore art museum" },
        { "time": "Evening", "description": "🍷 Enjoy rooftop dinner" }
      ]
    }
    // Repeat for each day up to ${duration}
  ]
}
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    if (!response) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to generate trip' });
    }

    const tripResult = parseMarkdownToJson(response.text);

    if (!tripResult) {
      return res
        .status(500)
        .json({ success: false, message: 'Failed to parse trip' });
    }

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&&client_id=${unsplashApiKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const trip = new TripModel({
      userId,
      title: tripResult.title,
      description: tripResult.description,
      estimatedPrice: tripResult.estimatedPrice,
      duration: tripResult.duration,
      budget: tripResult.budget,
      travelStyle: tripResult.travelStyle,
      country: tripResult.country,
      interests: tripResult.interests,
      groupType: tripResult.groupType,
      bestTimeToVisit: tripResult.bestTimeToVisit,
      weatherInfo: tripResult.weatherInfo,
      location: tripResult.location,
      itinerary: tripResult.itinerary,
      imageUrls,
    });

    await trip.save();

    res.status(200).json({ success: true, message: 'Trip created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to generate trip' });
  }
};
