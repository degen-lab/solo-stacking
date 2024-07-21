import { Switch } from "@nextui-org/react";
import { useDetailedView } from "@/app/contexts/DetailedViewContext";

export const DetailedViewSwitch = () => {
  const { detailedView, toggleView } = useDetailedView();

  return (
    <Switch
      defaultSelected={detailedView === true}
      size="md"
      color="success"
      onClick={() => toggleView()}
    >
      Detailed view
    </Switch>
  );
};
