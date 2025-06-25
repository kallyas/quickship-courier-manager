import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
}

interface PaginationMeta {
  total: number;
  from: number;
  to: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props {
  locations: {
    data: Location[];
    links: PaginationLink[];
    meta: PaginationMeta;
  };
}

export default function Index({ locations }: Props) {
  return (
    <AppLayout>
      <Head title="Locations" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
            <p className="text-muted-foreground">
              Manage pickup and delivery locations
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
          </CardHeader>
          <CardContent>
            {locations.data.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No locations yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add locations to enable pickup and delivery services.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Location
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locations.data.map((location) => (
                  <Card key={location.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {location.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {location.city}, {location.state} {location.postal_code}
                          </p>
                          <p className="text-sm text-gray-600">{location.country}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}