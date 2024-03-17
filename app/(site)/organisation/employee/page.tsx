import { EmployeeClient } from "./components/client";
import { EmployeeColumn } from "./components/columns"

export const DirectoryPage = () => {

    const formattedCategories: EmployeeColumn[] = [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EmployeeClient data={formattedCategories} />
            </div>
        </div>)
}

export default DirectoryPage;