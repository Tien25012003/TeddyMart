import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export default function EventBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const label = t(`event.${status}`);
  switch (status) {
    case "IN_PROGRESS":
      return <Tag color="blue">{label}</Tag>;

    case "DONE":
      return <Tag color="green">{label}</Tag>;

    case "PENDING":
      return <Tag color="red">{label}</Tag>;

    case "NOT_START":
      return <Tag color="cyan">{label}</Tag>;
    default:
      return <></>;
  }
}
