import { getDictionary } from "@/lib/i18n/dictionaries";
import { ContactForm } from "@/components/contact-form";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function ContactPage({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="container py-8 md:py-12">
      <ContactForm dictionary={dictionary.contact} lang={params.lang} />
    </div>
  );
}
