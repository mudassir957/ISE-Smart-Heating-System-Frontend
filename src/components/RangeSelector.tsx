import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

type Window = "1h" | "1d" | "7d";

export default function RangeSelector({
  value,
  onChange,
}: {
  value: Window;
  onChange: (v: Window) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Window)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="1h">1 hour</TabsTrigger>
        <TabsTrigger value="1d">1 day</TabsTrigger>
        <TabsTrigger value="7d">7 days</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}