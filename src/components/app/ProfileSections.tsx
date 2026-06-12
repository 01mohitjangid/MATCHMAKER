import { formatDate, formatHeight, formatIncome } from "@/lib/utils";
import type { Biodata, PartnerPreferences } from "@/types";

/** A labelled value cell. */
function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium wrap-break-word">{value}</dd>
    </div>
  );
}

/** A titled card containing a responsive grid of fields. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
        {title}
      </h2>
      <dl className="grid gap-x-6 gap-y-4 rounded-card border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </dl>
    </section>
  );
}

/** Full verified biodata for a person, grouped into themed sections. */
export function BiodataSections({ person }: { person: Biodata }) {
  return (
    <div className="space-y-6">
      <Section title="Personal">
        <Field label="First name" value={person.firstName} />
        <Field label="Last name" value={person.lastName} />
        <Field label="Gender" value={person.gender} />
        <Field
          label="Date of birth"
          value={formatDate(person.dateOfBirth)}
        />
        <Field label="Height" value={formatHeight(person.heightCm)} />
        <Field label="Marital status" value={person.maritalStatus} />
        <Field label="Siblings" value={person.siblings} />
        <Field
          label="Languages"
          value={person.languagesKnown.join(", ")}
        />
      </Section>

      <Section title="Location & contact">
        <Field label="City" value={person.city} />
        <Field label="Country" value={person.country} />
        <Field label="Email" value={person.email} />
        <Field label="Phone" value={person.phone} />
      </Section>

      <Section title="Education & career">
        <Field label="College" value={person.undergraduateCollege} />
        <Field label="Degree" value={person.degree} />
        <Field label="Company" value={person.currentCompany} />
        <Field label="Designation" value={person.designation} />
        <Field label="Income" value={formatIncome(person.incomeLPA)} />
      </Section>

      <Section title="Community">
        <Field label="Religion" value={person.religion} />
        <Field label="Caste" value={person.caste} />
        <Field label="Mother tongue" value={person.motherTongue} />
      </Section>

      <Section title="Lifestyle & family">
        <Field label="Diet" value={person.diet} />
        <Field label="Drinking" value={person.drinking} />
        <Field label="Smoking" value={person.smoking} />
        <Field label="Manglik" value={person.manglik} />
        <Field label="Family type" value={person.familyType} />
        <Field label="Family values" value={person.familyValues} />
        <Field label="Wants kids" value={person.wantKids} />
        <Field label="Open to relocate" value={person.openToRelocate} />
        <Field label="Open to pets" value={person.openToPets} />
      </Section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          About
        </h2>
        <p className="rounded-card border border-line bg-surface p-6 italic text-ink-soft">
          “{person.about}”
        </p>
      </section>
    </div>
  );
}

/** What the client is looking for in a partner. */
export function PreferencesSection({
  preferences,
}: {
  preferences: PartnerPreferences;
}) {
  const [minAge, maxAge] = preferences.ageRange;
  const heightRange = preferences.heightRangeCm
    ? `${formatHeight(preferences.heightRangeCm[0])} – ${formatHeight(
        preferences.heightRangeCm[1],
      )}`
    : "Any";

  return (
    <Section title="Partner preferences">
      <Field label="Age range" value={`${minAge} – ${maxAge} yrs`} />
      <Field label="Height range" value={heightRange} />
      <Field
        label="Religion"
        value={
          preferences.religions.length
            ? preferences.religions.join(", ")
            : "Open to all"
        }
      />
      <Field
        label="Min income"
        value={
          preferences.minIncomeLPA
            ? formatIncome(preferences.minIncomeLPA)
            : "No minimum"
        }
      />
      <Field
        label="Marital status"
        value={preferences.acceptableMaritalStatuses.join(", ")}
      />
      <Field label="Wants kids" value={preferences.wantKids} />
      <Field label="Relocation" value={preferences.relocationExpectation} />
      <Field
        label="Family values"
        value={preferences.preferredFamilyValues.join(", ")}
      />
      <Field label="Deal-breakers" value={preferences.dealBreakers} />
    </Section>
  );
}
