// import Footer from "@/components/footer";
import Header from "@/components/header";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={session?.user ?? null}
        className="sticky top-0 z-50 flex items-baseline justify-between border-b-2 p-2"
      />
      <main className="flex-1">{children}</main>
      {/* <Footer className="sticky bottom-0 z-50 flex items-baseline justify-between border-t-2 p-2" /> */}
    </div>
  );
}
