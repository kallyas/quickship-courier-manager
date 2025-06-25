import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  ArrowLeft,
  History,
  CreditCard,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Location {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  full_address: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface ShipmentHistory {
  id: number;
  status: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_by?: User;
}

interface Shipment {
  id: number;
  tracking_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  recipient_address: string;
  description: string;
  weight: number;
  dimensions?: string;
  declared_value?: number;
  service_type: string;
  status: string;
  status_label: string;
  price: number;
  payment_status: string;
  pickup_date?: string;
  delivery_date?: string;
  estimated_delivery?: string;
  notes?: string;
  created_at: string;
  sender: User;
  origin_location: Location;
  destination_location: Location;
  history: ShipmentHistory[];
}

interface Props {
  shipment: Shipment;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  picked_up: "bg-blue-100 text-blue-800",
  in_transit: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

export default function Show({ shipment }: Props) {
  return (
    <AppLayout>
      <Head title={`Shipment ${shipment.tracking_id}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={route("shipments.index")}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shipments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shipment {shipment.tracking_id}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={
                  statusColors[shipment.status as keyof typeof statusColors] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {shipment.status_label}
              </Badge>
              <span className="text-muted-foreground">
                Created {new Date(shipment.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1">{shipment.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Type</label>
                    <p className="mt-1 capitalize">{shipment.service_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weight</label>
                    <p className="mt-1">{shipment.weight} kg</p>
                  </div>
                  {shipment.dimensions && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dimensions</label>
                      <p className="mt-1">{shipment.dimensions}</p>
                    </div>
                  )}
                  {shipment.declared_value && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Declared Value</label>
                      <p className="mt-1">${shipment.declared_value}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price</label>
                    <p className="mt-1 font-semibold">${shipment.price}</p>
                  </div>
                </div>
                {shipment.notes && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="mt-1">{shipment.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Origin</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-medium">{shipment.origin_location.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {shipment.origin_location.full_address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Destination</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium">{shipment.destination_location.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {shipment.destination_location.full_address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Tracking History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipment.history.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                        {index < shipment.history.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium capitalize">
                            {entry.status.replace('_', ' ')}
                          </p>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleString()}
                          </span>
                        </div>
                        {entry.location && (
                          <p className="text-sm text-gray-600 mt-1">
                            Location: {entry.location}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{shipment.sender.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{shipment.sender.email}</span>
                  </div>
                  {shipment.sender.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{shipment.sender.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Recipient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{shipment.recipient_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{shipment.recipient_phone}</span>
                  </div>
                  {shipment.recipient_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{shipment.recipient_email}</span>
                    </div>
                  )}
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm mt-1">{shipment.recipient_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Amount:</span>
                    <span className="font-semibold">${shipment.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    <div className="flex items-center gap-2">
                      {shipment.payment_status === 'paid' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge 
                        variant={shipment.payment_status === 'paid' ? 'default' : 'secondary'}
                        className={shipment.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {shipment.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                      </Badge>
                    </div>
                  </div>
                  
                  {shipment.payment_status !== 'paid' && (
                    <div className="pt-2 border-t">
                      <Link href={route("payments.form", shipment.id)}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Now
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {shipment.payment_status === 'paid' && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Payment completed successfully</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            {(shipment.pickup_date || shipment.estimated_delivery || shipment.delivery_date) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shipment.pickup_date && (
                    <div className="flex justify-between text-sm">
                      <span>Pickup Date:</span>
                      <span>{new Date(shipment.pickup_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {shipment.estimated_delivery && (
                    <div className="flex justify-between text-sm">
                      <span>Est. Delivery:</span>
                      <span>{new Date(shipment.estimated_delivery).toLocaleDateString()}</span>
                    </div>
                  )}
                  {shipment.delivery_date && (
                    <div className="flex justify-between text-sm">
                      <span>Delivered:</span>
                      <span className="font-semibold text-green-600">
                        {new Date(shipment.delivery_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}