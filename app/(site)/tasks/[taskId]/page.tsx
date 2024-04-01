"use client";

import { TaskForm } from "@/components/task/task-form";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Profile } from "@/types/profile";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const TaskFormPage = ({ params }: { params: { taskId: string } }) => {

    const [data, setData] = useState(null);

    const [isLoading, setLoading] = useState(true)

    const [profile, setProfile] = useState<Profile[]>([])
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            setLoading(true);

            if (params.taskId != 'new') {
                const employees = await apiClient.get(`/tasks/${params.taskId}`);
                setData(employees.data)
            }

            const profiles = await apiClient.get(`/profile?pageSize=100`);
            setProfile(profiles.data.content)
 
            setLoading(false);
        })()
    }, [params.taskId])



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {isLoading ? (
                    <div className="grid h-screen place-items-center">
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                    </div>
                ) : (
                    <TaskForm initialData={data} profileList={profile} />
                )}
            </div>
        </div>

    );
};


export default TaskFormPage;