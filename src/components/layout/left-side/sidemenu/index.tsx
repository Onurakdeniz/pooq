import { SideMenuItem } from "./item";
import { SIDE_MENU_ITEMS } from "@/lib/constants";

export const SideMenu: React.FC = () => {
  return (
    <div className="flex-col flex ">
      {SIDE_MENU_ITEMS.map((item,index) => (
        <SideMenuItem key={index} title={item.title} Icon={item.icon} />
      ))}
    </div>
  );
};

export default SideMenu;
