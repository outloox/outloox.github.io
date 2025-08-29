import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AppSidebar } from "@/components/shared/app-sidebar";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "en" | "ar" };
}) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex min-h-screen bg-muted/40">
      <AppSidebar dictionary={dictionary.header} lang={lang} />
      <div className="flex flex-col flex-1">
        <Header dictionary={dictionary.header} lang={lang} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <Footer dictionary={dictionary.footer} />
      </div>
    </div>
  );
}
