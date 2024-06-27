import Link from "next/link";
import { ReactSVG, ReactSVGElement } from "react";

interface SideMenuItemProps {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href : string
}

export const SideMenuItem: React.FC<SideMenuItemProps> = ({ title, Icon , href }) => {
  const isActive = Math.random() > 0.4
  return (
    <Link href={`/${href}`}>
    <div
    className={`flex gap-4 items-center  text-primary/70
    
     hover:bg-primary-foreground hover:cursor-pointer  py-3 px-2`}
  >
   
      <Icon className="w-5 h-5" />
      <div className="text-base ">
        {title}
      </div>

    </div>
    </Link>
  );
};
