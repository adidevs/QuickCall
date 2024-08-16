"use server";
import dbConnect from "@/lib/dbConnect";
import Meeting from "@/models/Meeting";

const idGenerator = async () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetArray = alphabet.split("");
  const alphabetLength = alphabetArray.length;
  const idLength = 12;
  let id = "";

  for (let i = 0; i < idLength; i++) {
    if (i === 3 || i === 8) {
      id += "-";
    } else {
      const randomIndex = Math.floor(Math.random() * alphabetLength);
      id += alphabetArray[randomIndex];
    }
  }
  return id;
};

export const createMeeting = async (meetingCreator: string) => {
  try {
    await dbConnect();

    while (true) {
      const id = await idGenerator();
      const meeting = await Meeting.findOne({ id });
      if (!meeting) {
        const storeMeeting = await Meeting.create({
          id,
          members: [meetingCreator],
          createdBy: meetingCreator,
          createdAt: new Date(),
        });
        if (storeMeeting) return id;
        else continue;
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error generating meeting id");
  }
};

export const joinMeeting = async (meetingId: string, newMember: string) => {
  try {
    await dbConnect();
    const getMeeting = await Meeting.findOne({ id: meetingId });
    if (!getMeeting) throw new Error("Meeting not found");
    getMeeting.members.push(newMember);
    await getMeeting.save();
    return getMeeting.id;
  } catch (error) {
    console.error(error);
    throw new Error("Error joining meeting");
  }
};
