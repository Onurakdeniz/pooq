import React from "react";

interface HeaderItemProps {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ title, Icon }) => {
  const isActive= Math.random() > 0.5
  const colorClass = isActive ? "text-red-500" : "text-blue-500";
  return (
    <div className="flex gap-2 items-center">
      <Icon  className={`h-4 w-4 ${colorClass}`} />
      <div className={colorClass}> {title} </div>
    </div>
  );
};

export default HeaderItem;
