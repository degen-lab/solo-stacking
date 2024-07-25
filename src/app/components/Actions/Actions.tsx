import {
  openExtendPage,
  openIncreasePage,
  userStateAtom,
} from "@/app/utils/atoms";
import { useAtom } from "jotai";
import type { PoxUserData } from "@/app/utils/queryFunctions";
import { ActionStackStx } from "./ActionStackStx";
import { ActionStackIncrease } from "./ActionStackIncrease";
import { ActionStackExtend } from "./ActionStackExtend";

export const ActionContainer: React.FC<{
  data: PoxUserData;
}> = ({ data }) => {
  const [userState] = useAtom(userStateAtom);
  const [increasePageOpen] = useAtom(openIncreasePage);
  const [extendPageOpen] = useAtom(openExtendPage);

  if (userState === "StackStx") return <ActionStackStx data={data} />;
  if (userState === "StackingConfirmed" || userState === "StackingMempool") {
    if (increasePageOpen && extendPageOpen) {
      throw new Error("Invalid state: both increase and extend pages open");
    } else if (increasePageOpen) {
      return <ActionStackIncrease data={data} />;
    } else if (extendPageOpen) {
      return <ActionStackExtend data={data} />;
    }
  }
  return null;
};
