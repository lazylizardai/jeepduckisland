import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const UploadDuckShotModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUpload = () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    toast({
      title: "Duck Shot Uploaded!",
      description: "Your duck photo is being verified...",
    });
    setOpen(false);
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="text-lg px-8 py-4">
          Upload Duck Shot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Your Duck Shot 🦆</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="duck-file">Select Photo</Label>
            <Input
              id="duck-file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>
          {file && (
            <p className="text-sm text-gray-500">Selected: {file.name}</p>
          )}
          <Button onClick={handleUpload} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload & Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDuckShotModal;
