import Header from "components/Header";
import {
  SubHeader,
  CardButton,
  Chart,
  GeneralReport,
  ProductReport,
} from "./components";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { COLORS } from "constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "state_management/reducers/rootReducer";

export default function ReportScreen() {
  const initialValue = {
    outcome: 0,
    revenue: 0,
    profit: 0,
    numberOfOrder: 0,
    importOrder: 0,
    exportOrder: 0,
  };
  const { t } = useTranslation();
  const CARD_TITLE: string[] = [
    t("report.outcome"),
    t("report.revenue"),
    t("report.profit"),
    t("report.numberOfOrder"),
    t("report.importOrder"),
    t("report.exportOrder"),
  ];
  const [time, setTime] = useState<D>({
    from: new Date(),
    to: new Date(),
  });
  const REPORTS = useSelector((state: RootState) => state.reportSlice);
  const [general, setGeneral] = useState<TReport>(initialValue);
  const [cards, setCards] = useState([
    {
      name: "outcome",
      displayName: t("report.outcome"),
      selected: true,
      color: COLORS.red,
    },
    {
      name: "revenue",
      displayName: t("report.revenue"),
      selected: true,
      color: COLORS.yellow,
    },
    {
      name: "profit",
      displayName: t("report.profit"),
      selected: true,
      color: COLORS.green,
    },
    {
      name: "numberOfOrder",
      displayName: t("report.numberOfOrder"),
      selected: true,
      color: COLORS.blue,
    },
    {
      name: "importOrder",
      displayName: t("sale.importOrder"),
      selected: true,
      color: COLORS.pink,
    },
    {
      name: "exportOrder",
      displayName: t("report.exportOrder"),
      selected: true,
      color: COLORS.seaBlue,
    },
  ]);
  useEffect(() => {
    let tmp = initialValue;
    REPORTS?.byDate?.forEach((r, i) => {
      if (
        new Date(r.date).getTime() >= new Date(time.from).getTime() &&
        new Date(r.date).getTime() <= new Date(time.to).getTime()
      ) {
        tmp.outcome += r.outcome;
        tmp.revenue += r.revenue;
        tmp.profit += r.profit;
        tmp.numberOfOrder += r.numberOfOrder;
        tmp.importOrder += r.importOrder;
        tmp.exportOrder += r.exportOrder;
      }
    });
    setGeneral(tmp);
  }, [REPORTS, time.from, time.to]);

  const onClickCard = (name: string) => {
    let tmp = cards.map((c) => {
      if (c.name === name) {
        return {
          ...c,
          selected: !c.selected,
        };
      }
      return c;
    });
    setCards(tmp);
  };
  return (
    <div className="bg-extreme_lg_grey pb-10 w-full">
      <Header width={"100%"} title={t("report.report")} />
      <SubHeader time={time} setTime={setTime} />
      <div className="p-5 grid md:grid-cols-3 gap-x-8 grid-cols-1 gap-y-4 sm:grid-cols-2">
        {cards?.map((card, i) => {
          return (
            <CardButton
              title={CARD_TITLE[i].toLocaleUpperCase()}
              key={i}
              onClick={() => onClickCard(card.name)}
              selected={card.selected}
              color={card.color}
              amount={Number(general[card.name])}
            />
          );
        })}
      </div>

      <Chart
        time={time}
        options={{
          outcome: cards[0].selected,
          revenue: cards[1].selected,
          profit: cards[2].selected,
          numberOfOrder: cards[3].selected,
          importOrder: cards[4].selected,
          exportOrder: cards[5].selected,
        }}
      />
      <GeneralReport />
      <ProductReport />
    </div>
  );
}
