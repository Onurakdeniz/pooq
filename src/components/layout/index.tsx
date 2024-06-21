
import { Header } from "./header";
import { LeftSide } from "./left-side";
import {RightSide} from "./right-side"
export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-10 flex min-h-screen flex-col justify-center ">
  
      <main className="flex h-full w-full ">
        <LeftSide className= "w-3/12 flex py-4  " />
        <div className="w-6/12 flex  ">{children}</div>
        <RightSide className= "w-3/12 flex py-4  " />
      </main>
 
    </div>
  );
}
