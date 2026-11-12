import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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

type Defaults = {
  wood?: string;
  steel?: string;
  height?: string;
  width?: string;
  depth?: string;
  bottles?: string;
};

export function InquiryForm({
  defaultModel = "",
  defaults,
  hideSpecs = false,
}: {
  defaultModel?: string;
  defaults?: Defaults;
  hideSpecs?: boolean;
}) {
  const lang = useMood((s) => s.lang);
  const addInquiry = useMood((s) => s.addInquiry);
  const t = ui[lang];
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState(defaultModel);

  useEffect(() => {
    setModel(defaultModel);
  }, [defaultModel]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();
    if (!name || !email || !notes) {
      toast.error(t.formError);
      return;
    }
    const chosenModel = String(fd.get("model") ?? model);
    const value = (key: string) => String(fd.get(key) ?? "").trim();
    setSending(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname: value("surname"),
          email,
          phone: value("phone"),
          role: value("role"),
          company: value("company"),
          model: chosenModel,
          wood: value("wood"),
          steel: value("steel"),
          height: value("height"),
          width: value("width"),
          depth: value("depth"),
          bottles: value("bottles"),
          notes,
          _website: value("_website"),
        }),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error("inquiry-delivery-failed");
      addInquiry({
        model: chosenModel,
        wood: value("wood"),
        steel: value("steel"),
        height: value("height"),
        width: value("width"),
        depth: value("depth"),
        bottles: value("bottles"),
      });
      toast.success(t.formSuccess);
      form.reset();
      setModel(defaultModel);
    } catch {
      toast.error(t.formNetworkError);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" name="_website" tabIndex={-1} autoComplete="off" />
      </div>
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

      {hideSpecs ? (
        <>
          <input type="hidden" name="model" value={model} />
          <input type="hidden" name="wood" value={defaults?.wood ?? ""} />
          <input type="hidden" name="steel" value={defaults?.steel ?? ""} />
          <input type="hidden" name="height" value={defaults?.height ?? ""} />
          <input type="hidden" name="width" value={defaults?.width ?? ""} />
          <input type="hidden" name="depth" value={defaults?.depth ?? ""} />
          <input type="hidden" name="bottles" value={defaults?.bottles ?? ""} />
        </>
      ) : (
        <>
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
              <select id="wood" name="wood" className={selectClass} defaultValue={defaults?.wood ?? ""}>
                <option value="">{t.formSelect}</option>
                {woods.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label[lang]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.formSteel} htmlFor="steel">
              <select id="steel" name="steel" className={selectClass} defaultValue={defaults?.steel ?? ""}>
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
              <Input
                id="height"
                name="height"
                type="number"
                min={50}
                max={250}
                defaultValue={defaults?.height}
              />
            </Field>
            <Field label={t.formWidth} htmlFor="width">
              <Input
                id="width"
                name="width"
                type="number"
                min={40}
                max={400}
                defaultValue={defaults?.width}
              />
            </Field>
            <Field label={t.formDepth} htmlFor="depth">
              <Input
                id="depth"
                name="depth"
                type="number"
                min={8}
                max={80}
                defaultValue={defaults?.depth}
              />
            </Field>
            <Field label={t.formBottles} htmlFor="bottles">
              <Input
                id="bottles"
                name="bottles"
                type="number"
                min={1}
                max={200}
                defaultValue={defaults?.bottles}
              />
            </Field>
          </div>
        </>
      )}

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
