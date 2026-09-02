import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/portal/ui";
import SettingsForm from "@/components/admin/SettingsForm";

const DEFAULTS: Record<string, string> = {
  contact_email: "info@an-nur.online",
  contact_phone: "",
  absence_email_enabled: "true",
  bank_details_text: "",
};

export default async function SettingsPage() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: Object.keys(DEFAULTS) } },
  });
  const values = { ...DEFAULTS };
  for (const row of rows) values[row.key] = row.value;

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Academy-wide contact details and automation switches"
      />
      <SettingsForm
        values={{
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          absence_email_enabled: values.absence_email_enabled,
          bank_details_text: values.bank_details_text,
        }}
      />
    </div>
  );
}
