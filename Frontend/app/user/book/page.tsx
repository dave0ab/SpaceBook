import { fetchSpaces } from "@/lib/server-api";
import { getTranslations } from "@/lib/i18n-server";
import { BookingContent } from "@/components/user/BookingContent";

export const dynamic = "force-dynamic";

export default async function UserBookPage() {
  const [spaces, t] = await Promise.all([
    fetchSpaces(),
    getTranslations(),
  ]);

  return (
    <BookingContent initialSpaces={spaces || []} />
  );
}
