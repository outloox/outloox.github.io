import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, ShieldCheck, HelpCircle, KeyRound, AlertTriangle } from 'lucide-react';

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
      <div className="mb-12 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60">
          {docs.title}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          {docs.description}
        </p>
      </div>

      <div className="space-y-10">
        <Card className="border-primary/20 bg-card shadow-lg transition-all duration-300 hover:shadow-primary/10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl"><Bot className="h-8 w-8" /> {docs.how_it_works.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-muted-foreground text-base list-decimal pl-5">
              <li className="pl-2">{docs.how_it_works.step1}</li>
              <li className="pl-2">{docs.how_it_works.step2}</li>
              <li className="pl-2">{docs.how_it_works.step3}</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl"><ShieldCheck className="h-8 w-8" /> {docs.safety_guide.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground text-base">
             <p>{docs.safety_guide.description}</p>
             <ul className="list-disc list-inside space-y-2 pt-2">
                <li>{docs.safety_guide.point1}</li>
                <li>{docs.safety_guide.point2}</li>
                <li>{docs.safety_guide.point3}</li>
             </ul>
          </CardContent>
        </Card>
        
        <div className="mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 flex items-center justify-center gap-x-3">
                <section.icon className="h-8 w-8 text-primary rtl:ml-3" />
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(section.items).map(([key, value], itemIndex) => (
                  <AccordionItem 
                    value={key} 
                    key={key} 
                    className="rounded-lg mb-2 bg-card border shadow-sm animate-fade-in-up"
                    style={{ animationDelay: `${0.5 + sectionIndex * 0.1 + itemIndex * 0.05}s` }}
                  >
                    <AccordionTrigger className="text-lg text-left rtl:text-right px-6 py-4 hover:no-underline">{value.q}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground px-6">
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
