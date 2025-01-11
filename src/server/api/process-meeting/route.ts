import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@clerk/nextjs/server";
import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";

const bodyParser = z.object({
	meetingUrl: z.string(),
	projectId: z.string(),
	meetingId: z.string(),
});

export async function POST(req: NextRequest) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = req.json();
		const { meetingUrl, projectId, meetingId } = bodyParser.parse(body);
		const { summaries } = await processMeeting(meetingUrl);
		await db.issue
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}