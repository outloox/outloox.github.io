"use client";

import { useForm, useFormState as useReactHookFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Dictionary } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type ContactFormProps = {
  dictionary: Dictionary['contact'];
  lang: 'en' | 'ar';
}

const contactFormSchema = (dictionary: Dictionary['contact']) => z.object({
  name: z.string().min(2, { message: dictionary.error_message }),
  email: z.string().email({ message: dictionary.error_message }),
  message: z.string().min(10, { message: dictionary.error_message }),
});

// A new, self-contained function to send the form data to Telegram.
// This runs on the client-side, making it compatible with static export.
async function sendTelegramMessage(name: string, email: string, messageText: string) {
    const contactBotToken = '7712257349:AAFY5feUQytjcbUJ443fySEx7SsqvLp1980';
    const contactChatId = '6022061821';
    const url = `https://api.telegram.org/bot${contactBotToken}/sendMessage`;

    const telegramMessage = `
*New Contact Form Submission*
-----------------------------
*Name:* ${name}
*Email:* ${email}
*Message:*
${messageText}
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: contactChatId,
                text: telegramMessage,
                parse_mode: 'Markdown',
            }),
        });
        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return false;
    }
}


export function ContactForm({ dictionary, lang }: ContactFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<ReturnType<typeof contactFormSchema>>>({
    resolver: zodResolver(contactFormSchema(dictionary)),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { isSubmitting } = useReactHookFormState({ control: form.control });

  // This is the new form action. It's defined directly in the component.
  const formAction = async (prevState: any, formData: FormData) => {
    const validatedFields = contactFormSchema(dictionary).safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return { success: false, message: dictionary.error_message };
    }

    const { name, email, message } = validatedFields.data;

    const telegramSuccess = await sendTelegramMessage(name, email, message);

    if (telegramSuccess) {
      return { success: true, message: dictionary.success_message };
    } else {
      return { success: false, message: dictionary.error_message };
    }
  };
  
  const [state, dispatchFormAction] = useFormState(formAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast({
        title: dictionary.success_title,
        description: state.message,
      });
      form.reset();
    } else if (state.message) {
       toast({
        variant: "destructive",
        title: dictionary.error_title,
        description: state.message,
      });
    }
  }, [state, toast, form, dictionary]);


  return (
    <Card className="w-full max-w-lg mx-auto bg-card border">
        <CardHeader>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form
              action={(formData) => {
                form.handleSubmit(() => dispatchFormAction(formData))();
              }}
              className="space-y-6"
            >
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.name}</FormLabel>
                    <FormControl>
                        <Input placeholder={dictionary.name_placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.email}</FormLabel>
                    <FormControl>
                        <Input placeholder={dictionary.email_placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dictionary.message}</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder={dictionary.message_placeholder}
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? dictionary.submitting : dictionary.submit}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
