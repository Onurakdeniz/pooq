import { Button } from "@/components/ui/button";
import { ChevronsDown, ReplyAll } from "lucide-react";

const PostFooter = ({replyCount} : {replyCount:number}) => {
  return (
    <div className="flex  items-center justify-end">
      <Button
        variant={"ghost"}
        className="flex h-6 items-center  gap-1 bg-accent px-2   text-xs   text-primary/50 shadow-none  "
      >
        <ChevronsDown size={16} strokeWidth={1} />
        <div>  {replyCount} replies</div>
      </Button>
    </div>
  );
};

export default PostFooter;
