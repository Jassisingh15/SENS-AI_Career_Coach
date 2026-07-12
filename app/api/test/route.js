import { inngest } from "@/lib/inngest/client";

export async function GET() {
  await inngest.send({
    name: "test/insights",
    data: { msg: "hello bro" },
  });

  return new Response("Event Sent");
}