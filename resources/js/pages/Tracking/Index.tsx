import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Search, Package, Truck } from "lucide-react";

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 rounded-full p-4">
                  <Package className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Track Your Shipment
              </h1>
              <p className="text-lg text-gray-600">
                Enter your tracking ID to get real-time updates on your package
              </p>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Package Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="tracking_id">Tracking ID</Label>
                    <Input
                      id="tracking_id"
                      type="text"
                      placeholder="Enter your tracking ID (e.g., QS-12345-ABCDE)"
                      value={data.tracking_id}
                      onChange={(e) => setData("tracking_id", e.target.value)}
                      className="mt-1"
                      required
                    />
                    {errors.tracking_id && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.tracking_id}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={processing}
                    size="lg"
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

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Get instant notifications about your package status
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Tracking</h3>
                <p className="text-gray-600 text-sm">
                  See exactly where your package is in real-time
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Updates</h3>
                <p className="text-gray-600 text-sm">
                  Know exactly when your package will arrive
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}