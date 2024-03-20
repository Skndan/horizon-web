import * as React from 'react';
 
import { useState } from 'react';
import SidebarNav from './side-menu';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
 
const MobileNav = () => {
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } 

  return (
    <Sheet>
      <SheetTrigger>
        <Button asChild variant="ghost" size="icon" className="md:hidden">
          <Menu className='h-6 w-6'/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarNav  />
      </SheetContent>
    </Sheet>
  );
}




export default MobileNav;
