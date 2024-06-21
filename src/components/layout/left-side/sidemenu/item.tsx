import { ReactSVG, ReactSVGElement } from "react";

interface SideMenuItemProps {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const SideMenuItem: React.FC<SideMenuItemProps> = ({ title, Icon }) => {
  const isActive = Math.random() > 0.4
  return (
    <div
    className={`flex gap-4 items-center ${
      isActive ? "text-emerald-500 font-semibold " : "text-primary/70"
    } hover:bg-primary-foreground hover:cursor-pointer  py-3 px-2`}
  >
      <Icon className="w-5 h-5" />
      <div className="text-base ">
        {title}
      </div>
    </div>
  );
};
