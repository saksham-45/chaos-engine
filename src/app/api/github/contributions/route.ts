import { NextResponse } from "next/server";
import { CALENDAR_URL, parseCalendar } from "@/lib/contributions";

export async function GET() {
  try {
    const res = await fetch(CALENDAR_URL, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(String(res.status));
    const data = parseCalendar(await res.text());
    if (data.days.length < 300) throw new Error("calendar markup changed");
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("contributions:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
