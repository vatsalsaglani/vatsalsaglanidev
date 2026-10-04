"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/profile";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(now) {
  const h = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${DAYS[now.getDay()]} ${h % 12 || 12}:${minutes} ${h >= 12 ? "PM" : "AM"}`;
}

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please tell me your name.";
  if (!EMAIL_RE.test(email.trim())) errors.email = "That email address does not look right.";
  if (message.trim().length < 10) errors.message = "A sentence or two helps (at least 10 characters).";
  return errors;
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (insecure context or denied); the mailto link still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className="btn-ghost shrink-0 font-mono text-[11px] uppercase tracking-wider"
    >
      <CopyIcon />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function LinkRow({ link }) {
  return (
    <li className="border-b border-line/10 first:border-t">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 py-4 transition-colors hover:text-accent"
      >
        <span className="eyebrow w-28 shrink-0 transition-colors group-hover:text-accent">{link.label}</span>
        <span className="min-w-0 flex-1 truncate text-base">{link.handle}</span>
        <ArrowUpRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-1" />
      </a>
    </li>
  );
}

const fieldClass =
  "w-full border-0 border-b border-line/20 bg-transparent py-3 text-base text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent aria-[invalid=true]:border-accent";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-2 font-mono text-xs text-accent"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(
    `${values.message}${values.name ? `\n\n${values.name}` : ""}`,
  )}`;

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const reset = () => {
      setValues({ name: "", email: "", message: "", company: "" });
      setStatus("sent");
    };

    // Honeypot: real visitors never see this field. Pretend success for bots.
    if (values.company) return reset();

    setStatus("sending");
    const now = new Date();
    try {
      await fetch(profile.contactEndpoint, {
        method: "POST",
        mode: "no-cors", // Google Apps Script does not send CORS headers; the response is opaque.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: now.toISOString(),
          formattedTime: formatTime(now),
          source: "portfolio-v2",
        }),
      });
      reset();
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-busy={sending}>
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={update("company")}
        />
      </div>

      <Field id="contact-name" label="Name" error={errors.name}>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={update("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClass}
          placeholder="Ada Lovelace"
        />
      </Field>
      <Field id="contact-email" label="Email" error={errors.email}>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={fieldClass}
          placeholder="ada@example.com"
        />
      </Field>
      <Field id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass} resize-y`}
          placeholder="What are you working on?"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" disabled={sending} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {sending ? "Sending..." : "Send message"}
          {!sending && <ArrowUpRightIcon className="h-4 w-4" />}
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" && (
            <motion.p
              key="sent"
              role="status"
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-mono text-xs text-signal"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              Sent. Thanks, I will reply soon.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              role="alert"
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs text-accent"
            >
              Something went wrong. Please try again or email me directly.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="font-mono text-xs text-muted">
        Or{" "}
        <a href={mailto} className="link-underline text-fg">
          email me directly
        </a>
        .
      </p>
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line/10 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <em>useful</em>
            </>
          }
          lede={profile.availabilityNote}
        />

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-16 lg:grid-cols-2 lg:gap-24"
        >
          <motion.div variants={fadeUp} className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="link-underline min-w-0 break-all font-serif text-display-md"
              >
                {profile.email}
              </a>
              <CopyEmail />
            </div>

            <ul className="mt-12">
              {Object.values(profile.links).map((link) => (
                <LinkRow key={link.label} link={link} />
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="relative min-w-0">
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ArrowUpRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}
