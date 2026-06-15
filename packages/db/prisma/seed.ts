import { prisma } from "../index";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"];
const NAMES = [
  "Suraj Kumar",
  "Priya Patel",
  "Arjun Sharma",
  "Neha Gupta",
  "Rohan Mehta",
  "Ananya Das",
  "Vikram Nair",
  "Sneha Rao",
  "Amit Singh",
  "Rahul Verma",
  "Karan Johar",
  "Deepika Padukone",
  "Ranbir Kapoor",
  "Alia Bhatt",
  "Virat Kohli",
  "M.S. Dhoni",
  "Sachin Tendulkar",
  "Aishwarya Rai",
  "Hrithik Roshan",
  "Katrina Kaif",
];

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.communication.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Users...");
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@xenolite.com",
      password: "password123", // Dummy mock password
    },
  });

  console.log("Seeding customer and order database...");

  const customersData = [];

  // Generate 100 realistic customers with targeted profiles
  for (let i = 0; i < 100; i++) {
    const name =
      NAMES[i % NAMES.length] + " " + (Math.floor(i / NAMES.length) + 1);
    const email = `customer-${i + 1}@example.com`;
    const phone = `+919876543${String(i + 1).padStart(3, "0")}`;
    const city = CITIES[i % CITIES.length];

    // Determine target profile for this customer
    const orders = [];
    let totalSpent = 0;

    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    if (i % 8 === 0) {
      orders.push({ amount: 3500, category: "Sneakers", createdAt: daysAgo(50) });
      orders.push({ amount: 800, category: "Apparel", createdAt: daysAgo(60) });
      totalSpent = 4300;
    } else if (i % 8 === 1) {
      orders.push({ amount: 250, category: "Coffee", createdAt: daysAgo(15) });
      orders.push({ amount: 320, category: "Coffee", createdAt: daysAgo(25) });
      totalSpent = 570;
    } else if (i % 8 === 2) {
      orders.push({ amount: 8500, category: "Sneakers", createdAt: daysAgo(75) });
      orders.push({ amount: 4200, category: "Apparel", createdAt: daysAgo(90) });
      totalSpent = 12700;
    } else if (i % 8 === 3) {
      for (let j = 0; j < 5; j++) {
        orders.push({ amount: 600 + j * 100, category: "Coffee", createdAt: daysAgo(2 + j * 5) });
      }
      totalSpent = 4000;
    } else if (i % 8 === 4) {
      orders.push({ amount: 16000, category: "Apparel", createdAt: daysAgo(110) });
      totalSpent = 16000;
    } else {
      const orderCount = 1 + (i % 4);
      for (let j = 0; j < orderCount; j++) {
        const category = ["Sneakers", "Apparel", "Beauty", "Accessories", "Coffee"][(i + j) % 5];
        const amount = 500 + ((i * 123 + j * 50) % 4500);
        orders.push({ amount, category, createdAt: daysAgo(5 + j * 20) });
        totalSpent += amount;
      }
    }

    customersData.push({
      name,
      email,
      phone,
      city,
      totalSpent,
      orders,
    });
  }

  // Insert customers sequentially
  let customerCount = 0;
  let orderCount = 0;
  const createdCustomers = [];

  for (const customer of customersData) {
    const created = await prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        totalSpent: customer.totalSpent,
        orders: {
          create: customer.orders,
        },
      },
    });
    createdCustomers.push(created);
    customerCount++;
    orderCount += customer.orders.length;
  }

  console.log(`Successfully seeded ${customerCount} customers and ${orderCount} orders.`);

  console.log("Seeding Campaigns and Communications...");
  const campaignsData = [
    {
      name: "Summer Sale 2026",
      message: "Hey! Use code SUMMER26 for 20% off all apparel.",
      channel: "SMS",
      status: "COMPLETED",
      audienceQuery: JSON.stringify({ cities: ["Bengaluru", "Mumbai"] }),
    },
    {
      name: "Win-back Flow",
      message: "We miss you! Here is 10% off your next coffee order.",
      channel: "WHATSAPP",
      status: "RUNNING",
      audienceQuery: JSON.stringify({ minSpent: 500 }),
    },
    {
      name: "Sneaker Drop",
      message: "Exclusive access to the new sneaker drop. Click here!",
      channel: "EMAIL",
      status: "DRAFT",
      audienceQuery: JSON.stringify({ category: "Sneakers" }),
    },
  ];

  const createdCampaigns = [];
  for (const c of campaignsData) {
    const camp = await prisma.campaign.create({
      data: {
        name: c.name,
        message: c.message,
        channel: c.channel,
        status: c.status as any,
        audienceQuery: c.audienceQuery,
      },
    });
    createdCampaigns.push(camp);
  }

  let commCount = 0;

  // For the COMPLETED campaign, simulate a full funnel on 80 customers
  const c1 = createdCampaigns[0];
  const c1Customers = createdCustomers.slice(0, 80);
  for (let i = 0; i < c1Customers.length; i++) {
    let status = "SENT";
    if (i < 16) status = "CLICKED";       // 20% Clicked
    else if (i < 48) status = "READ";     // 60% Read
    else if (i < 72) status = "DELIVERED";// 90% Delivered
    else if (i < 78) status = "SENT";     // 97.5% Sent
    else status = "FAILED";               // 2.5% Failed

    const sentAt = new Date(Date.now() - 100000000);
    const deliveredAt = ["DELIVERED", "READ", "CLICKED"].includes(status) ? new Date(sentAt.getTime() + 5000) : null;
    const readAt = ["READ", "CLICKED"].includes(status) ? new Date(sentAt.getTime() + 60000) : null;
    const clickedAt = status === "CLICKED" ? new Date(sentAt.getTime() + 120000) : null;

    await prisma.communication.create({
      data: {
        campaignId: c1.id,
        customerId: c1Customers[i].id,
        status: status as any,
        sentAt,
        deliveredAt,
        readAt,
        clickedAt,
      },
    });
    commCount++;
  }

  // For the RUNNING campaign, simulate an active flow on 50 customers
  const c2 = createdCampaigns[1];
  const c2Customers = createdCustomers.slice(50, 100);
  for (let i = 0; i < c2Customers.length; i++) {
    let status = "PENDING";
    if (i < 5) status = "CLICKED";
    else if (i < 15) status = "READ";
    else if (i < 25) status = "DELIVERED";
    else if (i < 40) status = "SENT";

    const sentAt = ["SENT", "DELIVERED", "READ", "CLICKED"].includes(status) ? new Date(Date.now() - 10000) : null;
    const deliveredAt = ["DELIVERED", "READ", "CLICKED"].includes(status) ? new Date(sentAt!.getTime() + 1000) : null;
    const readAt = ["READ", "CLICKED"].includes(status) ? new Date(sentAt!.getTime() + 5000) : null;
    const clickedAt = status === "CLICKED" ? new Date(sentAt!.getTime() + 8000) : null;

    await prisma.communication.create({
      data: {
        campaignId: c2.id,
        customerId: c2Customers[i].id,
        status: status as any,
        sentAt,
        deliveredAt,
        readAt,
        clickedAt,
      },
    });
    commCount++;
  }

  console.log(`Successfully seeded ${createdCampaigns.length} campaigns and ${commCount} communications.`);
  console.log("Database seed complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
