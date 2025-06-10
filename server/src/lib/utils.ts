import { TripDocument } from '../models/TripModel';

export function parseMarkdownToJson(
  markdownText: string | undefined
): Partial<TripDocument> | null {
  const regex = /```json\n([\s\S]+?)\n```/;
  const match = markdownText?.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  console.error('No valid JSON found in markdown text.');
  return null;
}

export function extractJson(raw: string) {
  try {
    // Strip any markdown if Gemini still adds it
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw;
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Gemini response was not valid JSON');
  }
}

// const runMigration = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
//     console.log('Connected to MongoDB');

//     const result = await UserModel.updateMany(
//       { isDeleted: { $exists: false } },
//       { $set: { isDeleted: false } }
//     );

//     console.log(
//       `✅ Migration complete: ${result.modifiedCount} user(s) updated.`
//     );
//   } catch (error) {
//     console.error('❌ Migration failed:', error);
//   } finally {
//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
//   }
// };

// runMigration();
