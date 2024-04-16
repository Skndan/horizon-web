"use client"

import { EmptyStateTable } from "@/components/common/empty-state-table";
import { DataTable } from "@/components/ui/data-table";
import { FileInfo, Profile } from "@/types/profile"
import { Loader, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useUpdateStore } from "@/store/use-update-store";
import apiClient from "@/lib/api/api-client";
import { useAuth } from "@/context/auth-provider";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";

interface AccountCardProps {
    profile: Profile | null;
};


const formSchema = z.object({
    profile: z.any().optional(),
    organisation: z.any().optional(),
    file: z
        .any()
        .refine((file) => file?.length >= 1, 'File is required.')
        .refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`),
});


type EmployeeFormValues = z.infer<typeof formSchema>


export const FileCard: React.FC<AccountCardProps> = ({
    profile,
}) => {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<FileInfo[]>([])
    const [isOpen, setOpen] = useState(false);
    const { user } = useAuth();

    async function fetchData() {
        await apiClient.get(`/file/get-by-profile/${profile ? profile.id : user?.profileId}`).then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            });
    }

    const { flag, set } = useUpdateStore();

    useEffect(() => {
        fetchData();
    }, [flag])

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile: { id: '' },
            organisation: { id: '' }
        },
        mode: "onChange"
    });

    const fileRef = form.register('file', { required: true });

    const onSubmit = async (data: EmployeeFormValues) => {
        try {

            var dd = {
                profile: {
                    id: user?.profileId
                }
            };

            var formData = new FormData();
            formData.append('data', JSON.stringify(dd));

            for (const file of data.file) {
                formData.append("file", file);
            }

            await apiClient
                .post("/file", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                },)
                .then((res) => res.data)
                .then((data) => {
                    toast.success("Uploaded");
                    set(`${Math.random()}`);
                    setOpen(false)
                });

        } catch (error: any) {
            toast.error('Something went wrong.');
            setOpen(false)
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Modal title={"Upload files"} description={"Click to below to select files"} isOpen={isOpen} onClose={() => setOpen(false)}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        {/* <FormLabel>File <span className="text-red-500">*</span></FormLabel> */}
                                        <FormControl>
                                            <Input type="file"
                                                multiple
                                                {...fileRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <Button disabled={loading} className="ml-auto" type="submit">
                            {loading &&
                                <Loader className="animate-spin h-5 w-5 mr-3" />}
                            Upload
                        </Button>
                    </form>
                </Form>
            </Modal>
            <div className="flex-col">
                <div className="flex-1">


                    <div className="flex justify-end pb-4">
                        <Button onClick={() => setOpen(true)}> <Upload className="mr-2 h-4 w-4" /> Upload</Button>
                    </div>

                    {loading ?
                        (
                            <div className="grid h-screen place-items-center">
                                <Loader className="animate-spin h-5 w-5 mr-3" />
                            </div>
                        )
                        : (
                            data.length == 0 ? <EmptyStateTable
                                title={"No Files added"}
                                description={"You have not added any files. Add one below."}
                                action={"Add File"}
                                onClick={() => setOpen(true)}
                            /> : <DataTable searchKey="fileName" columns={columns} data={data} />
                        )}
                </div>
            </div>
        </>
    )
}