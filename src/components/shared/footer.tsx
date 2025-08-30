import type { Dictionary } from "@/lib/types";

type FooterProps = {
  dictionary: Dictionary["footer"];
};

export function Footer({ dictionary }: FooterProps) {
  return (
    <footer className="py-6 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <p className="font-semibold text-foreground">
            {dictionary.disclaimer_title}
          </p>
          <p>{dictionary.disclaimer_text}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Outloox. {dictionary.rights_reserved}
        </p>
      </div>
    </footer>
  );
}
