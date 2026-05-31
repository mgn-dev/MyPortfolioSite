import { SocialIcon, socialIconClass } from "@/components/portfolio/social-icons";
import type { SiteSocial } from "@/lib/pocketbase";

export function SocialsList({ socials }: { socials: SiteSocial[] }) {
  if (socials.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {socials.map((social) => (
        <li key={`${social.icon}-${social.href}`}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="inline-flex items-center justify-center rounded-full p-1.5 text-heading transition-opacity hover:opacity-70"
          >
            <SocialIcon
              name={social.icon}
              className={socialIconClass(social.icon, "lg")}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
