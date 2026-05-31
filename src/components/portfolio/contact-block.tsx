"use client";

import { Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { SocialsList } from "@/components/portfolio/socials-list";
import { WhatsAppIcon } from "@/components/portfolio/social-icons";
import type { SiteSocial } from "@/lib/pocketbase";
import { whatsappUrl } from "@/lib/whatsapp";

type ContactBlockProps = {
  contactEmail?: string;
  contactWhatsapp?: string;
  socials?: SiteSocial[];
};

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactBlock({
  contactEmail,
  contactWhatsapp,
  socials = [],
}: ContactBlockProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const waLink = whatsappUrl(contactWhatsapp);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted">
        Have a question or a project in mind? Say hello.
      </p>

      <SocialsList socials={socials} />

      {(contactEmail || waLink) && (
        <ul className="mb-20 flex flex-col gap-4 text-sm">
          {contactEmail && (
            <li className="flex items-center gap-2.5">
              <Mail
                className="size-5 shrink-0 text-heading"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>
                <span className="text-muted">Email: </span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-heading underline-offset-2 hover:underline"
                >
                  {contactEmail}
                </a>
              </span>
            </li>
          )}
          {waLink && contactWhatsapp && (
            <li className="flex items-center gap-2.5">
              <WhatsAppIcon className="size-5 shrink-0 text-heading" />
              <span>
                <span className="text-muted">WhatsApp: </span>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-heading underline-offset-2 hover:underline"
                >
                  {contactWhatsapp}
                </a>
              </span>
            </li>
          )}
        </ul>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="sr-only">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={status === "sending"}
              placeholder="Your name"
              className="min-h-12 w-full rounded-2xl border border-transparent bg-input px-4 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 disabled:opacity-60 dark:focus:ring-white/15"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="sr-only">
              Your email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={status === "sending"}
              placeholder="Your email"
              className="min-h-12 w-full rounded-2xl border border-transparent bg-input px-4 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 disabled:opacity-60 dark:focus:ring-white/15"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-message" className="sr-only">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            disabled={status === "sending"}
            placeholder="Your message"
            className="w-full resize-y rounded-2xl border border-transparent bg-input px-4 py-3 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 disabled:opacity-60 dark:focus:ring-white/15"
          />
        </div>

        {status === "success" && (
          <p className="text-sm text-heading" role="status">
            Thanks — your message was sent.
          </p>
        )}
        {status === "error" && errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-12 w-full rounded-2xl bg-btn text-sm font-medium text-btn-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
