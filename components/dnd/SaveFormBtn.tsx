import { Loader2, SaveAll } from "lucide-react";
import { Button } from "../ui/button";  
import { useTransition } from "react";
import useDesigner from "@/hooks/useDesigner";
import toast from "react-hot-toast";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      // TODO
      console.log(jsonElements);
      // await UpdateFormContent(id, jsonElements);
      toast.success("Your form has been saved!");  
    } catch (error) { 
      toast.error("Something went wrong!"); 
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <SaveAll className="h-6 w-6" />
      Save
      {loading && <Loader2 className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
