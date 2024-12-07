import { forwardRef } from "react";

type TOptions = {
  warrantyID?: boolean;
  partnerName?: boolean;
  gender?: boolean;
  phoneNumber?: boolean;
  email?: boolean;
  address?: boolean;
  debt?: boolean;
  totalBuyAmount?: boolean;
  certificate?: boolean;
  note?: boolean;
};
type Props = {
  search?: string;
};

const WarrantyTable = forwardRef<HTMLTableElement, Props>(({ search }, ref) => {
  return <></>;
});

export default WarrantyTable;
