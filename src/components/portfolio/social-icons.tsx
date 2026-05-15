import type { ComponentType, SVGProps } from "react";
import type { SocialIconName } from "@/content/site";

function iconProps(className?: string): SVGProps<SVGSVGElement> {
  return {
    className,
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };
}

/** X / Twitter */
function XIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M23.5 6.2c-.3-1.1-1.2-2-2.3-2.3C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.2.4c-1.1.3-2 1.2-2.3 2.3C0 8 0 12 0 12s0 4 .5 5.8c.3 1.1 1.2 2 2.3 2.3 1.8.4 9.2.4 9.2.4s7.4 0 9.2-.4c1.1-.3 2-1.2 2.3-2.3.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.35 4.24 5.41v6.33zM5.34 7.43a2.06 2.06 0 01-2.06-2.06 2.06 2.06 0 114.12 0 2.06 2.06 0 01-2.06 2.06zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 7.2c-2.65 0-4.8 2.15-4.8 4.8s2.15 4.8 4.8 4.8 4.8-2.15 4.8-4.8-2.15-4.8-4.8-4.8zm0 7.9c-1.71 0-3.1-1.39-3.1-3.1S10.29 8.9 12 8.9s3.1 1.39 3.1 3.1-1.39 3.1-3.1 3.1zm6.11-8.04h-2.22c.15.77.24 1.56.24 2.38 0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c.82 0 1.61.09 2.38.24V3.22A9.93 9.93 0 0012 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.07-.17-2.1-.49-3.06zm2.49-3.06h-3.18v3.18h3.18V4z" />
    </svg>
  );
}

const icons: Record<SocialIconName, ComponentType<{ className?: string }>> = {
  twitter: XIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
};

export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
