import { Divider } from "@nextui-org/react";
import { ReactNode } from "react";

export const PoxDetailsStructure: React.FC<{
  children: ReactNode[];
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="flex-col text-center justify-items-center justify-center border-2 border-[#F5F5F5] rounded-lg p-4 lg:min-h-[30rem] h-auto lg:min-h-[25rem] w-[65vw] lg:w-[30vw] mb-10 mx-auto">
      <h1 className="font-bold mb-2 text-xl">{title}</h1>
      <Divider className="mb-6" />
      {children.map((child, index) => (
        <div key={`poxDetail${index}`} className="mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};
