import { Tag } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function WarrantyBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const label = useMemo(() => t(`warranty.${status}`), []);
  switch (status) {
    case "REQUEST":
      return <Tag color="red">{label}</Tag>;

    case "SEND_TO_SUPPLIER":
      return <Tag color="blue">{label}</Tag>;

    case "FIXED":
      return <Tag color="green">{label}</Tag>;

    case "RETURN_TO_CUSTOMER":
      return <Tag color="purple">{label}</Tag>;
    default:
      return <></>;
  }
}
