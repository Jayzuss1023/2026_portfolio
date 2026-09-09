"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact";

const initialValues: ContactInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactInput, string>>
  >({});
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof ContactInput>(
    key: K,
    value: ContactInput[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as keyof ContactInput] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});
    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        if (!response.ok) {
          toast.error("Could not send your message. Please try again.");
          return;
        }

        await response.json().catch(() => null);

        toast.success("Message sent — thanks for reaching out.");
        setValues(initialValues);
      } catch {
        toast.error("Network error. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.name) || undefined}>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(fieldErrors.name) || undefined}
            disabled={isPending}
          />
          <FieldError>{fieldErrors.name}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.email) || undefined}>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email) || undefined}
            disabled={isPending}
          />
          <FieldError>{fieldErrors.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.subject) || undefined}>
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input
            id="contact-subject"
            name="subject"
            value={values.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            aria-invalid={Boolean(fieldErrors.subject) || undefined}
            disabled={isPending}
          />
          <FieldError>{fieldErrors.subject}</FieldError>
        </Field>

        <Field data-invalid={Boolean(fieldErrors.message) || undefined}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(fieldErrors.message) || undefined}
            disabled={isPending}
          />
          <FieldError>{fieldErrors.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
