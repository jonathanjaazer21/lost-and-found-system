import type { ActionFunctionArgs } from "react-router";
import { sendUpdateNotification } from "~/actions/lostItems.server";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json();

  await sendUpdateNotification({
    description: data.description,
    mobile_number: data.mobile_number,
    upload_url: data.upload_url,
    status: data.status || 'unclaimed',
    recipients: data.recipients || [],
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
