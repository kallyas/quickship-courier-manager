import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { MessageCircle, Phone, Mail, Clock, HelpCircle } from "lucide-react";

export default function Index() {
  return (
    <AppLayout>
      <Head title="Support" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with your shipments and account
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">1-800-QUICKSHIP</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Mail className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@quickship.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9 AM - 6 PM EST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="What can we help you with?" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Describe your issue or question..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How do I track my shipment?</h3>
                <p className="text-sm text-muted-foreground">
                  You can track your shipment using the tracking ID provided when you created the shipment. 
                  Simply go to the "Track Package" page and enter your tracking ID.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards (Visa, MasterCard, American Express, Discover) 
                  through our secure Stripe payment system.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">How long does delivery take?</h3>
                <p className="text-sm text-muted-foreground">
                  Delivery times vary based on the service type selected and distance. 
                  Standard delivery typically takes 3-5 business days, while express delivery takes 1-2 business days.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I modify or cancel my shipment?</h3>
                <p className="text-sm text-muted-foreground">
                  You can modify or cancel your shipment before it's picked up. 
                  Once the shipment is in transit, modifications may not be possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}