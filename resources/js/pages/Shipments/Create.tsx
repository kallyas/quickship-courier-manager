import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, Package } from "lucide-react";

interface Location {
  id: number;
  name: string;
  city: string;
  state: string;
  full_address: string;
}

interface Props {
  locations: Location[];
}

export default function Create({ locations }: Props) {
    console.log(locations);
  const { data, setData, post, processing, errors } = useForm({
    recipient_name: "",
    recipient_phone: "",
    recipient_email: "",
    recipient_address: "",
    origin_location_id: "",
    destination_location_id: "",
    description: "",
    weight: "",
    dimensions: "",
    declared_value: "",
    service_type: "standard",
    price: "",
    pickup_date: "",
    estimated_delivery: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("shipments.store"));
  };

  return (
    <AppLayout>
      <Head title="Create New Shipment" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={route("shipments.index")}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shipments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Shipment</h1>
            <p className="text-muted-foreground">
              Fill out the form below to create a new shipment
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recipient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient_name">Full Name *</Label>
                  <Input
                    id="recipient_name"
                    value={data.recipient_name}
                    onChange={(e) => setData("recipient_name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                  {errors.recipient_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.recipient_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient_phone">Phone Number *</Label>
                  <Input
                    id="recipient_phone"
                    value={data.recipient_phone}
                    onChange={(e) => setData("recipient_phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                  {errors.recipient_phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.recipient_phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient_email">Email Address</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={data.recipient_email}
                    onChange={(e) => setData("recipient_email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                  {errors.recipient_email && (
                    <p className="text-red-600 text-sm mt-1">{errors.recipient_email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient_address">Delivery Address *</Label>
                  <Textarea
                    id="recipient_address"
                    value={data.recipient_address}
                    onChange={(e) => setData("recipient_address", e.target.value)}
                    placeholder="123 Main St, Apt 4B, City, State 12345"
                    rows={3}
                    required
                  />
                  {errors.recipient_address && (
                    <p className="text-red-600 text-sm mt-1">{errors.recipient_address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Package Description *</Label>
                  <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Electronics, documents, etc."
                    required
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={data.weight}
                      onChange={(e) => setData("weight", e.target.value)}
                      placeholder="2.50"
                      required
                    />
                    {errors.weight && (
                      <p className="text-red-600 text-sm mt-1">{errors.weight}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dimensions">Dimensions (L×W×H)</Label>
                    <Input
                      id="dimensions"
                      value={data.dimensions}
                      onChange={(e) => setData("dimensions", e.target.value)}
                      placeholder="30×20×10 cm"
                    />
                    {errors.dimensions && (
                      <p className="text-red-600 text-sm mt-1">{errors.dimensions}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="declared_value">Declared Value ($)</Label>
                  <Input
                    id="declared_value"
                    type="number"
                    step="0.01"
                    value={data.declared_value}
                    onChange={(e) => setData("declared_value", e.target.value)}
                    placeholder="100.00"
                  />
                  {errors.declared_value && (
                    <p className="text-red-600 text-sm mt-1">{errors.declared_value}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="service_type">Service Type *</Label>
                  <Select
                    value={data.service_type}
                    onValueChange={(value) => setData("service_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (3-5 business days)</SelectItem>
                      <SelectItem value="express">Express (1-2 business days)</SelectItem>
                      <SelectItem value="overnight">Overnight (Next business day)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.service_type && (
                    <p className="text-red-600 text-sm mt-1">{errors.service_type}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Shipping Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    placeholder="15.99"
                    required
                  />
                  {errors.price && (
                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Route</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin_location_id">Origin Location *</Label>
                <Select
                  value={data.origin_location_id}
                  onValueChange={(value) => setData("origin_location_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name} - {location.city}, {location.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.origin_location_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.origin_location_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="destination_location_id">Destination Location *</Label>
                <Select
                  value={data.destination_location_id}
                  onValueChange={(value) => setData("destination_location_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name} - {location.city}, {location.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destination_location_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.destination_location_id}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Optional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup_date">Pickup Date</Label>
                  <Input
                    id="pickup_date"
                    type="date"
                    value={data.pickup_date}
                    onChange={(e) => setData("pickup_date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.pickup_date && (
                    <p className="text-red-600 text-sm mt-1">{errors.pickup_date}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                  <Input
                    id="estimated_delivery"
                    type="date"
                    value={data.estimated_delivery}
                    onChange={(e) => setData("estimated_delivery", e.target.value)}
                    // min date should be later than today
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.estimated_delivery && (
                    <p className="text-red-600 text-sm mt-1">{errors.estimated_delivery}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData("notes", e.target.value)}
                  placeholder="Any special handling instructions or notes..."
                  rows={3}
                />
                {errors.notes && (
                  <p className="text-red-600 text-sm mt-1">{errors.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href={route("shipments.index")}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? "Creating..." : "Create Shipment"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
