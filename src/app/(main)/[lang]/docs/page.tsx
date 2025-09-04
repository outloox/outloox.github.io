import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, ShieldCheck, Send, HelpCircle, KeyRound, AlertTriangle } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }]
}

export default async function DocsPage({
  params,
}: {
  params: { lang: "en" | "ar" };
}) {
  const dictionary = await getDictionary(params.lang);
  const docs = dictionary.docs;

  const sections = [
    { 
      title: docs.basics.title, 
      icon: KeyRound, 
      items: docs.basics.questions 
    },
    { 
      title: docs.verification_process.title, 
      icon: HelpCircle, 
      items: docs.verification_process.questions 
    },
    { 
      title: docs.troubleshooting.title, 
      icon: AlertTriangle, 
      items: docs.troubleshooting.questions 
    },
  ];

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          {docs.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {docs.description}
        </p>
      </div>

      <div className="space-y-10">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl"><Bot className="h-8 w-8" /> {docs.how_it_works.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-base md:text-lg">
              <li>{docs.how_it_works.step1}</li>
              <li>{docs.how_it_works.step2}</li>
              <li>{docs.how_it_works.step3}</li>
            </ol>
            <div className="mt-8 text-center">
                <Button asChild size="lg">
                    <Link href="https://t.me/CHK5277BOT" target="_blank" rel="noopener noreferrer">
                         <Send className="me-2 h-5 w-5"/> {docs.how_it_works.cta}
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl"><ShieldCheck className="h-8 w-8" /> {docs.safety_guide.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground text-base md:text-lg">
             <p>{docs.safety_guide.description}</p>
             <ul className="list-disc list-inside space-y-2 pt-2">
                <li>{docs.safety_guide.point1}</li>
                <li>{docs.safety_guide.point2}</li>
                <li>{docs.safety_guide.point3}</li>
             </ul>
          </CardContent>
        </Card>
        
        <div className="mx-auto">
          {sections.map((section) => (
            <div key={section.title} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 flex items-center justify-center gap-x-3">
                <section.icon className="h-8 w-8 text-primary rtl:ml-3" />
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(section.items).map(([key, value]) => (
                  <AccordionItem value={key} key={key}>
                    <AccordionTrigger className="text-xl text-left rtl:text-right">{value.q}</AccordionTrigger>
                    <AccordionContent className="text-base md:text-lg text-muted-foreground">
                      {value.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
