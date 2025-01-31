import { NextResponse } from 'next/server';
import { Product } from '@/types/product';

// Featured products (subset of products that are featured)
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'AMD Ryzen 9 5900X',
    price: 499.99,
    description: '12 cores, 24 threads, up to 4.8 GHz max boost',
    category: 'CPU',
    stock: 10,
    image: 'https://placehold.co/600x400/222222/FFFFFF?text=AMD+Ryzen+9+5900X',
    specifications: {
      cores: '12',
      threads: '24',
      baseSpeed: '3.7 GHz',
      boostSpeed: '4.8 GHz',
      cache: '64MB',
      tdp: '105W'
    },
    brand: 'AMD',
    model: 'Ryzen 9 5900X'
  },
  {
    id: '2',
    name: 'NVIDIA GeForce RTX 4080',
    price: 1199.99,
    description: 'High-performance gaming graphics card with ray tracing',
    category: 'GPU',
    stock: 5,
    image: 'https://placehold.co/600x400/076900/FFFFFF?text=RTX+4080',
    specifications: {
      memory: '16GB GDDR6X',
      coreClock: '2.21 GHz',
      rtCores: '76',
      tensorCores: '304',
      hdmi: '1x HDMI 2.1',
      displayPort: '3x DisplayPort 1.4a'
    },
    brand: 'NVIDIA',
    model: 'RTX 4080'
  },
  {
    id: '3',
    name: 'Samsung 970 EVO Plus 1TB',
    price: 99.99,
    description: 'NVMe M.2 SSD with exceptional performance',
    category: 'Storage',
    stock: 15,
    image: 'https://placehold.co/600x400/000069/FFFFFF?text=Samsung+SSD',
    specifications: {
      capacity: '1TB',
      interface: 'PCIe Gen 3.0 x4',
      readSpeed: '3,500 MB/s',
      writeSpeed: '3,300 MB/s',
      form: 'M.2 2280',
      endurance: '600 TBW'
    },
    brand: 'Samsung',
    model: '970 EVO Plus'
  }
];

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(featuredProducts);
} 