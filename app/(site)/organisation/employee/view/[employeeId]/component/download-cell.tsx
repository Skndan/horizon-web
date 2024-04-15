import { useEffect, useState } from "react"; 
import apiClient from "@/lib/api/api-client"; 
import { Button } from "@/components/ui/button";
var mime = require('mime-types')

export default function DownloadFileButton({ fileName, filePath }: {fileName: string, filePath: string}) {
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileType, setFileType] = useState(null);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/static${filePath}`, {
        responseType: "blob", // Important
      });

      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);

      setDownloadUrl(blobUrl);

      // Determine MIME type from file extension
      const extension = filePath.split('.').pop();
      const mimeType = mime.lookup(extension);
      setFileType(mimeType);
    } catch (error) {
      console.error(`Failed to fetch file:`, error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch file when component mounts
  }, []);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup
    }
  };

  return (
    <div>
      <Button onClick={handleDownload} disabled={!downloadUrl} variant={"link"}>
        {fileName}
      </Button> 
    </div>
  );
}
