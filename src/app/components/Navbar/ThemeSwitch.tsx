// import { useTheme } from "@/app/contexts/ThemeContext";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../Images/SunIcon";
import { MoonIcon } from "../Images/MoonIcon";
import { useTheme } from "next-themes";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      defaultSelected={theme === "dark"}
      size="md"
      color="success"
      startContent={<SunIcon />}
      endContent={theme === "light" && <MoonIcon />}
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
    >
      Dark mode
    </Switch>
  );
};
