import { ADMANAGER_STATUS_TYPE } from "@/interfaces/ISocial";
import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function SwitchStatus({
  value,
  onToggle,
}: {
  value: string;
  onToggle: (status: ADMANAGER_STATUS_TYPE) => void;
}) {
  const [status, setStatus] = useState(value);

  useEffect(() => {
    setStatus(value);
  }, [value]);

  return (
    <div>
      <Switch
        color="primary"
        size="sm"
        onValueChange={(value) => {
          setStatus(value ? "ACTIVE" : "PAUSED");
          onToggle(value ? "ACTIVE" : "PAUSED");
        }}
        isSelected={status === "ACTIVE"}
      ></Switch>
    </div>
  );
}
