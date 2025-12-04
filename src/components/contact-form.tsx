"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useTransition } from "react";

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
import { Loader2, Send, AtSign } from "lucide-react";

type ContactFormProps = {
  dictionary: Dictionary['contact'];
  lang: 'en' | 'ar';
  setOpen: (open: boolean) => void;
}

const contactFormSchema = (dictionary: Dictionary['contact']) => z.object({
  telegramUser: z.string().min(2, { message: dictionary.error_telegram_message }),
  message: z.string().min(10, { message: dictionary.error_message_message }),
});

async function sendTelegramMessage(telegramUser: string, messageText: string) {
    const contactBotToken = '7712257349:AAFY5feUQytjcbUJ443fySEx7SsqvLp1980';
    const contactChatId = '6022061821';
    const url = `https://api.telegram.org/bot${contactBotToken}/sendMessage`;

    const telegramMessage = `
*New Contact Form Submission*
-----------------------------
*Telegram User:* @${telegramUser.replace('@', '')}
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


export function ContactForm({ dictionary, lang, setOpen }: ContactFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<ReturnType<typeof contactFormSchema>>>({
    resolver: zodResolver(contactFormSchema(dictionary)),
    defaultValues: {
      telegramUser: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<ReturnType<typeof contactFormSchema>>) {
    startTransition(async () => {
      const telegramSuccess = await sendTelegramMessage(values.telegramUser, values.message);

      if (telegramSuccess) {
        toast({
          title: dictionary.success_title,
          description: dictionary.success_message,
        });
        form.reset();
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: dictionary.error_title,
          description: dictionary.error_general_message,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="telegramUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.telegram_user}</FormLabel>
              <FormControl>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={dictionary.telegram_user_placeholder} {...field} className="pl-9" />
                </div>
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
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isPending ? dictionary.submitting : dictionary.submit}
        </Button>
      </form>
    </Form>
  );
}
