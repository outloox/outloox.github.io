import type { Dictionary } from "@/lib/types";

type FooterProps = {
  dictionary: Dictionary;
};

export function Footer({ dictionary }: FooterProps) {
  if (!dictionary?.footer) {
    return null;
  }
  const { footer } = dictionary;
  return (
    <footer className="py-6 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Outloox. {footer.rights_reserved}
        </p>
      </div>
    </footer>
  );
}
