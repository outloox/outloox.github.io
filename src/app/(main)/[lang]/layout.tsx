import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import type { Dictionary } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "en" | "ar" };
}) {
  const { lang } = params;
  const dictionary: Dictionary = await getDictionary(lang);
  
  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex h-screen w-full flex-col bg-background">
      <Header dictionary={dictionary} lang={lang} />
      <ScrollArea className="flex-1">
        <main className="flex-1">{children}</main>
        <Footer dictionary={dictionary} />
      </ScrollArea>
    </div>
  );
}
