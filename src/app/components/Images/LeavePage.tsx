import { useTheme } from "next-themes";

export const LeavePage: React.FC<{ width: number; inverted: boolean }> = ({
  width,
  inverted,
}) => {
  const { resolvedTheme: theme } = useTheme();
  return (
    <svg
      width={`${width}px`}
      height={`${width}px`}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 15V19.5H5.5V5.5H16.5V10M10 12.5H22.5"
        stroke={
          theme === "dark"
            ? inverted
              ? "black"
              : "white"
            : inverted
            ? "white"
            : "black"
        }
        strokeWidth="1.2"
      />
      <path
        d="M20 10L22.5 12.5L20 15"
        stroke={
          theme === "dark"
            ? inverted
              ? "black"
              : "white"
            : inverted
            ? "white"
            : "black"
        }
        strokeWidth="1.2"
      />
    </svg>
  );
};
