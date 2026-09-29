import { Mail, Phone } from "lucide-react";
import { personal, phoneHref } from "@/content/site";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

/** Email, LinkedIn and (optionally) phone, as an icon row. */
export function ContactLinks({ className = "" }: { className?: string }) {
  const items = [
    {
      href: `mailto:${personal.email}`,
      label: personal.email,
      icon: <Mail size={17} aria-hidden />,
    },
    {
      href: personal.linkedin,
      label: "linkedin.com/in/aarav-aher",
      icon: <LinkedInIcon size={16} />,
      external: true,
    },
    ...(personal.showPhone
      ? [
          {
            href: phoneHref,
            label: personal.phone,
            icon: <Phone size={16} aria-hidden />,
          },
        ]
      : []),
  ];

  return (
    <ul className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 ${className}`}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group inline-flex items-center gap-2.5 text-sm text-primary transition-colors hover:text-accent"
          >
            <span className="text-primary-soft transition-colors group-hover:text-accent">
              {item.icon}
            </span>
            <span className="break-all underline decoration-primary/20 underline-offset-4 transition-colors group-hover:decoration-accent sm:break-normal">
              {item.label}
            </span>
            {item.external && <span className="sr-only">(opens in a new tab)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
