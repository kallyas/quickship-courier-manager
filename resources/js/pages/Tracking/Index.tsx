import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Search, Package } from "lucide-react";

export default function TrackingIndex() {
  const { data, setData, post, processing, errors } = useForm({
    tracking_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("tracking.track"));
  };

  return (
    <AppLayout>
      <Head title="Track Your Shipment" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track Your Shipment</h1>
          <p className="text-muted-foreground">
            Enter your tracking ID to view real-time shipment status
          </p>
        </div>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking_id">Tracking ID</Label>
                <Input
                  id="tracking_id"
                  type="text"
                  placeholder="Enter tracking ID (e.g., QS-12345-ABCDE)"
                  value={data.tracking_id}
                  onChange={(e) => setData("tracking_id", e.target.value.toUpperCase())}
                  className="font-mono"
                  required
                />
                {errors.tracking_id && (
                  <p className="text-red-600 text-sm">
                    {errors.tracking_id}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={processing}
              >
                {processing ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Package
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Get instant notifications about your package status
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Simple interface to track all your shipments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Detailed History</h3>
              <p className="text-sm text-muted-foreground">
                Complete tracking history and delivery updates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}