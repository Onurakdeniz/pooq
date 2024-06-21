import { SideMenuItem } from "./item";
import { SIDE_MENU_ITEMS } from "@/lib/constants";

export const SideMenu: React.FC = () => {
  return (
    <div className="flex-col flex ">
      {SIDE_MENU_ITEMS.map((item) => (
        <SideMenuItem title={item.title} Icon={item.icon} />
      ))}
    </div>
  );
};

export default SideMenu;
