import useDesigner from "@/hooks/useDesigner";
import React from "react"; 
import FormElementsSidebar from "./form-element-sidebar";
import PropertiesFormSidebar from "./properties-form-sidebar";

function DesignerSidebar() {
  const { selectedElement } = useDesigner();

  return (
    <aside className="flex h-full w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4">
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  );
}

export default DesignerSidebar;