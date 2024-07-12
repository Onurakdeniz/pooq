import { cookies } from "next/headers";
import { SideMenuItem } from "./item";
import { SIDE_MENU_ITEMS } from "@/lib/constants";

export const SideMenu: React.FC = async () => {
  const cookieStore = cookies();
  
  // Retrieve privyId and userFid from cookies
  const privyId = cookieStore.get('privy_id')?.value;
  const userFid = cookieStore.get('user_fid')?.value;
  
  return (
    <div className="flex-col flex mr-6 ">
      {SIDE_MENU_ITEMS.map((item, index) => {
        let href = item.href;
        
        // If the item is "Profile" and userFid exists, update the href
        if (item.title === "Profile" && userFid) {
          href = `profile/${userFid}`;
        }
        
        return (
          <SideMenuItem 
            key={index} 
            title={item.title} 
            Icon={item.icon} 
            href={href} 
          />
        );
      })}
    </div>
  );
};

export default SideMenu;