import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function HomePage({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <>
    <div className="container">
      <section className="text-center py-20 sm:py-32 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground/70 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {dictionary.landing.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            {dictionary.landing.description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Button asChild size="lg">
                <Link href={`/${params.lang}/dashboard`}>
                    {dictionary.landing.get_started}
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href={`/${params.lang}/docs`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    {dictionary.header.docs}
                </Link>
            </Button>
        </div>
      </section>
    </div>
    </>
  );
}
