import { FileText, Mail, Phone } from "lucide-react";
import { aboutCopy, heroCopy, personal, phoneHref } from "@/content/site";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

/** Email, LinkedIn, phone (if showPhone) and Resume as a quiet icon row. */
export function ContactLinks({ className = "" }: { className?: string }) {
  const items = [
    {
      href: `mailto:${personal.email}`,
      label: personal.email,
      icon: <Mail size={16} aria-hidden />,
    },
    {
      href: personal.linkedin,
      label: aboutCopy.linkedinLabel,
      icon: <LinkedInIcon size={15} />,
      external: true,
    },
    ...(personal.showPhone
      ? [{ href: phoneHref, label: personal.phone, icon: <Phone size={15} aria-hidden /> }]
      : []),
    {
      href: personal.resume,
      label: aboutCopy.resumeLabel,
      icon: <FileText size={15} aria-hidden />,
      external: true,
    },
  ];

  return (
    <ul className={`flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-primary sm:min-h-0"
          >
            <span className="text-primary-soft">{item.icon}</span>
            <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent-strong">
              {item.label}
            </span>
            {item.external && <span className="sr-only">{heroCopy.newTab}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
