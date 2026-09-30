import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { products, steels, woods } from "@/lib/catalog";
import { ui } from "@/lib/i18n";
import { useMood } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const selectClass =
  "flex h-11 w-full border border-border bg-surface px-3 text-sm text-fg focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

export function InquiryForm({ defaultModel = "" }: { defaultModel?: string }) {
  const lang = useMood((s) => s.lang);
  const addInquiry = useMood((s) => s.addInquiry);
  const t = ui[lang];
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState(defaultModel);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();
    if (!name || !email || !notes) {
      toast.error(t.formError);
      return;
    }
    setSending(true);
    addInquiry({
      name,
      surname: String(fd.get("surname") ?? ""),
      email,
      phone: String(fd.get("phone") ?? ""),
      role: String(fd.get("role") ?? ""),
      company: String(fd.get("company") ?? ""),
      model: String(fd.get("model") ?? model),
      wood: String(fd.get("wood") ?? ""),
      steel: String(fd.get("steel") ?? ""),
      height: String(fd.get("height") ?? ""),
      width: String(fd.get("width") ?? ""),
      depth: String(fd.get("depth") ?? ""),
      bottles: String(fd.get("bottles") ?? ""),
      notes,
    });
    const subject = encodeURIComponent(`${t.enquireAbout} ${fd.get("model") || "Pooly's Mood"}`);
    const body = encodeURIComponent(
      [
        `${name} ${fd.get("surname")}`,
        email,
        fd.get("phone"),
        fd.get("role"),
        fd.get("company"),
        `Model: ${fd.get("model")}`,
        `Wood: ${fd.get("wood")}`,
        `Steel: ${fd.get("steel")}`,
        `H/W/D: ${fd.get("height")} / ${fd.get("width")} / ${fd.get("depth")} cm`,
        `Bottles: ${fd.get("bottles")}`,
        notes,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.setTimeout(() => {
      setSending(false);
      toast.success(t.formSuccess);
      e.currentTarget.reset();
      setModel(defaultModel);
      window.location.href = `mailto:pooly.s_mood@outlook.com?subject=${subject}&body=${body}`;
    }, 400);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.formName} htmlFor="name">
          <Input id="name" name="name" autoComplete="given-name" required />
        </Field>
        <Field label={t.formSurname} htmlFor="surname">
          <Input id="surname" name="surname" autoComplete="family-name" />
        </Field>
        <Field label={t.formEmail} htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={t.formPhone} htmlFor="phone">
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
        <Field label={t.formRole} htmlFor="role">
          <Input id="role" name="role" placeholder={t.formRolePh} />
        </Field>
        <Field label={t.formCompany} htmlFor="company">
          <Input id="company" name="company" />
        </Field>
      </div>

      <Field label={t.formModel} htmlFor="model">
        <select
          id="model"
          name="model"
          className={selectClass}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">{t.formSelect}</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.formWood} htmlFor="wood">
          <select id="wood" name="wood" className={selectClass} defaultValue="">
            <option value="">{t.formSelect}</option>
            {woods.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label[lang]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.formSteel} htmlFor="steel">
          <select id="steel" name="steel" className={selectClass} defaultValue="">
            <option value="">{t.formSelect}</option>
            {steels.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label[lang]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <Field label={t.formHeight} htmlFor="height">
          <Input id="height" name="height" type="number" min={50} max={250} placeholder="50–250" />
        </Field>
        <Field label={t.formWidth} htmlFor="width">
          <Input id="width" name="width" type="number" min={40} max={400} placeholder="40–400" />
        </Field>
        <Field label={t.formDepth} htmlFor="depth">
          <Input id="depth" name="depth" type="number" min={8} max={80} placeholder="8–80" />
        </Field>
        <Field label={t.formBottles} htmlFor="bottles">
          <Input id="bottles" name="bottles" type="number" min={1} max={200} placeholder="6–200" />
        </Field>
      </div>

      <Field label={t.formNotes} htmlFor="notes">
        <Textarea id="notes" name="notes" required placeholder={t.formNotesPh} />
      </Field>

      <p className="text-xs leading-relaxed text-subtle">{t.privacy}</p>
      <Button type="submit" size="lg" disabled={sending}>
        {sending ? t.formSending : t.formSubmit}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
