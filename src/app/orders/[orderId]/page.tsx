"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";

// Mock data - replace with actual API call
const orderDetails = {
  id: "ORD001",
  date: "2024-01-30",
  status: "delivered",
  total: 1299.99,
  shipping: 15.99,
  tax: 78.00,
  items: [
    {
      id: 1,
      name: "AMD Ryzen 7 5800X",
      price: 449.99,
      quantity: 1,
      image: "/images/products/cpu.jpg",
    },
    {
      id: 2,
      name: "NVIDIA RTX 3070",
      price: 699.99,
      quantity: 1,
      image: "/images/products/gpu.jpg",
    },
    {
      id: 3,
      name: "Samsung 970 EVO Plus 1TB",
      price: 149.99,
      quantity: 1,
      image: "/images/products/ssd.jpg",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
  },
  timeline: [
    {
      status: "Order Placed",
      date: "2024-01-30 09:00 AM",
      icon: Package,
    },
    {
      status: "Order Shipped",
      date: "2024-01-31 02:30 PM",
      icon: Truck,
    },
    {
      status: "Order Delivered",
      date: "2024-02-01 11:15 AM",
      icon: CheckCircle,
    },
  ],
};

const statusColors = {
  processing: "bg-yellow-500",
  shipped: "bg-blue-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order {orderDetails.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(orderDetails.date).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={
                  statusColors[orderDetails.status as keyof typeof statusColors]
                }
              >
                {orderDetails.status.charAt(0).toUpperCase() +
                  orderDetails.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
              <div className="relative">
                {orderDetails.timeline.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start mb-4 last:mb-0"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <Icon className="h-6 w-6 text-primary" />
                          {index !== orderDetails.timeline.length - 1 && (
                            <div className="absolute top-6 left-3 w-0.5 h-full bg-gray-200" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(
                        orderDetails.items.reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Shipping
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(orderDetails.shipping)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Tax
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(orderDetails.tax)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(orderDetails.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Shipping Address */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="text-sm">
                <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                <p>{orderDetails.shippingAddress.street}</p>
                <p>
                  {orderDetails.shippingAddress.city},{" "}
                  {orderDetails.shippingAddress.state}{" "}
                  {orderDetails.shippingAddress.zipCode}
                </p>
                <p>{orderDetails.shippingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
