import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const WriteModal = ({className}) => {
    return (
        <form className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
        <Textarea className="min-h-60 max-h-96 text-primary/60 " placeholder="Type your message here." />
        </div>
        <div className="flex items-center justify-end">
        <Button className="w-20" type="submit">Write</Button>
        </div>
      </form>
    )
}

export default WriteModal


 