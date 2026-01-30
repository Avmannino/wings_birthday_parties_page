// src/App.jsx
import { useMemo, useState } from "react";
import logo from "./assets/logo.png";
import heroImg from "./assets/flow-room.jpg";

// ✅ Add a reviews background image (put a file at: src/assets/reviews-bg.jpg)
import reviewsBg from "./assets/reviews-bg.jpg";

/**
 * ✅ Formspree
 * 1) Create a form in Formspree and copy your endpoint URL.
 * 2) Paste it here (it looks like: https://formspree.io/f/xxxxxxxx)
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xreklooq";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredDate: "",
  estPeople: "",
  estSkateRentals: "",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.preferredDate) e.preferredDate = "Please choose a preferred date.";

    if (form.estPeople !== "" && Number(form.estPeople) < 0)
      e.estPeople = "Must be 0 or more.";
    if (form.estSkateRentals !== "" && Number(form.estSkateRentals) < 0)
      e.estSkateRentals = "Must be 0 or more.";

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onBlur(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function scrollToForm() {
    const el = document.getElementById("start-planning");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e) {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      preferredDate: true,
      estPeople: true,
      estSkateRentals: true,
    });

    if (hasErrors) {
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      setStatus({
        type: "error",
        message:
          "Form submit is not configured yet. Paste your Formspree endpoint into FORMSPREE_ENDPOINT.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      /**
       * ✅ Formspree recommended: send JSON + Accept header
       * Note: Formspree returns 200/302 typically; we handle non-OK.
       */
      const payload = {
        ...form,
        // helpful for email subject/routing inside Formspree
        _subject: `Birthday Party Request: ${form.firstName} ${form.lastName} (${form.preferredDate})`,
        _replyto: form.email,
        source: "Wings Arena Birthday Parties Form",
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Formspree often returns { errors: [...] } or { error: ... }
        const msg =
          data?.error ||
          (Array.isArray(data?.errors) && data.errors[0]?.message) ||
          "Request failed. Please try again.";
        throw new Error(msg);
      }

      setStatus({
        type: "success",
        message: "Thanks! Your request was sent. We’ll be in touch shortly.",
      });
      setForm(initialForm);
      setTouched({});
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="hero" role="banner">
        <div className="heroMedia" aria-hidden="true">
          <img className="heroImg" src={heroImg} alt="" />
          <div className="heroOverlay" />
        </div>

        <div className="heroInner">
          <img className="logo" src={logo} alt="Wings Arena" />
          <h1 className="heroTitle">Birthday Parties</h1>

          <p className="heroBody">
            Make your next birthday one to remember—celebrate at Wings Arena with a party
            that’s equal parts fun and easy. Our birthday party packages give you dedicated
            space for food, cake, and presents, plus plenty of ice time for the kids to skate,
            play, and burn off energy. Whether it’s their first time on skates or they’re
            already flying around the rink, our team helps keep everything running smoothly so
            you can enjoy the day without the stress. Pick a date, bring the candles, and let
            Wings Arena handle the rest—a birthday on the ice is always a win.
          </p>

          <div className="heroActions">
            <button className="btnPrimary" type="button" onClick={scrollToForm}>
              Start Planning
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="contentWrap" aria-label="Birthday party details">
          <div className="sectionHeader">
            <h2 className="sectionTitle">What to Expect</h2>
            <p className="sectionSub">
              A smooth, organized party day with plenty of ice time and a dedicated space to celebrate.
            </p>
          </div>

          <div className="infoGrid">
            <div className="infoCard">
              <h3 className="infoTitle">Dedicated Party Space</h3>
              <p className="infoText">
                Settle in with your group for food, cake, and gifts—then head back out for more skating.
              </p>
            </div>

            <div className="infoCard">
              <h3 className="infoTitle">Skates + Support</h3>
              <p className="infoText">
                Estimate rentals in the form below—our team will help coordinate details as we confirm.
              </p>
            </div>

            <div className="infoCard">
              <h3 className="infoTitle">Easy Planning</h3>
              <p className="infoText">
                Submit your preferred date and party size. We’ll follow up to confirm availability and next steps.
              </p>
            </div>
          </div>
        </section>

        {/* ✅ REVIEWS SECTION (full-bleed) */}
        <section className="reviews" aria-label="Reviews">
          <div className="reviewsMedia" aria-hidden="true">
            <img className="reviewsImg" src={reviewsBg} alt="" />
            <div className="reviewsOverlay" />
          </div>

          <div className="reviewsInner">
            <blockquote className="reviewQuote">
              “Great communication from start to finish, awesome energy from the staff, and a super memorable birthday for our kid—everything felt organized, easy, and genuinely fun for the whole group.”
            </blockquote>
            <div className="reviewBy">-Nicolas | Greenwich, CT</div>
          </div>
        </section>

        <section className="formSection" id="start-planning" aria-label="Start planning form">
          <div className="formHeader">
            <h2 className="formTitle">Start Planning</h2>
            <p className="formNote">
              Our Program Director, Joe will reach out to you with pricing options and availability.
            </p>
          </div>

          <div className="formCard">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="grid">
                <Field
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.firstName ? errors.firstName : ""}
                  autoComplete="given-name"
                />

                <Field
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.lastName ? errors.lastName : ""}
                  autoComplete="family-name"
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.email ? errors.email : ""}
                  autoComplete="email"
                />

                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.phone ? errors.phone : ""}
                  autoComplete="tel"
                  placeholder="(###) ###-####"
                />

                <Field
                  label="Preferred Party Date"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.preferredDate ? errors.preferredDate : ""}
                />

                <Field
                  label="Estimated Number of People"
                  name="estPeople"
                  type="number"
                  value={form.estPeople}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.estPeople ? errors.estPeople : ""}
                  min="0"
                  placeholder="e.g. 15"
                />

                <Field
                  label="Estimated Skate Rentals"
                  name="estSkateRentals"
                  type="number"
                  value={form.estSkateRentals}
                  onChange={updateField}
                  onBlur={onBlur}
                  error={touched.estSkateRentals ? errors.estSkateRentals : ""}
                  min="0"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="actions">
                <div className="actionsLeft">
                  {status.type !== "idle" ? (
                    <p className={`status ${status.type === "error" ? "statusError" : "statusSuccess"}`}>
                      {status.message}
                    </p>
                  ) : (
                    <>
                      <p className="hint">We typically respond within 1–2 business days.</p>
                      <p className="questions">
                        Questions? Reach out to our Program Director, Joe at{" "}
                        <a className="emailLink" href="mailto:jwanderlingh@wingsarena.com">
                          jwanderlingh@wingsarena.com
                        </a>
                      </p>
                    </>
                  )}
                </div>

                <div className="actionsRight">
                  <button className="btnPrimary btnSubmit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Wings Arena</span>
      </footer>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  min,
}) {
  const describedBy = error ? `${name}-error` : undefined;

  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        className={`input ${error ? "inputError" : ""}`}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={!!error}
        aria-describedby={describedBy}
      />

      {error ? (
        <div className="error" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
}
