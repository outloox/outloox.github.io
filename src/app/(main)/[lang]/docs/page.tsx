import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, AlertTriangle, KeyRound, Mail } from 'lucide-react';

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

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          {docs.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          {docs.description}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="h-6 w-6" /> {docs.login.title}</CardTitle>
            <CardDescription>{docs.login.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>{docs.login.step1}</li>
              <li>{docs.login.step2}</li>
              <li>{docs.login.step3}</li>
              <li>{docs.login.step4}</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-6 w-6" /> {docs.mail_access.title}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">{docs.mail_access.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-6 w-6" /> {docs.disclaimer.title}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">{docs.disclaimer.description}</p>
          </CardContent>
        </Card>
        
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">{docs.faq.title}</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{docs.faq.q1_title}</AccordionTrigger>
              <AccordionContent>
                {docs.faq.q1_answer}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{docs.faq.q2_title}</AccordionTrigger>
              <AccordionContent>
                {docs.faq.q2_answer}
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>{docs.faq.q3_title}</AccordionTrigger>
              <AccordionContent>
                {docs.faq.q3_answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
