"use client";

import { FormEvent } from "react";

export function ContactBlock() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Have a question or a project in mind? Say hello.
      </p>
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
              placeholder="Your name"
              className="min-h-12 w-full rounded-2xl border border-transparent bg-input px-4 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 dark:focus:ring-white/15"
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
              placeholder="Your email"
              className="min-h-12 w-full rounded-2xl border border-transparent bg-input px-4 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 dark:focus:ring-white/15"
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
            placeholder="Your message"
            className="w-full resize-y rounded-2xl border border-transparent bg-input px-4 py-3 text-heading placeholder:text-muted outline-none focus:border-border-subtle focus:ring-2 focus:ring-heading/15 dark:focus:ring-white/15"
          />
        </div>
        <button
          type="submit"
          className="min-h-12 w-full rounded-2xl bg-btn text-sm font-medium text-btn-fg transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
