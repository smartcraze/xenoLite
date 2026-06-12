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
      // Profile 1: Inactive sneaker buyers from Bengaluru, spent > ₹3000, no orders in 45 days
      orders.push({
        amount: 3500,
        category: "Sneakers",
        createdAt: daysAgo(50),
      });
      orders.push({
        amount: 800,
        category: "Apparel",
        createdAt: daysAgo(60),
      });
      totalSpent = 4300;
    } else if (i % 8 === 1) {
      // Profile 2: Coffee buyers who bought coffee twice last month, but not this week
      orders.push({
        amount: 250,
        category: "Coffee",
        createdAt: daysAgo(15),
      });
      orders.push({
        amount: 320,
        category: "Coffee",
        createdAt: daysAgo(25),
      });
      totalSpent = 570;
    } else if (i % 8 === 2) {
      // Profile 3: High-value premium customer at churn risk (spent > ₹12000, last order 70 days ago)
      orders.push({
        amount: 8500,
        category: "Sneakers",
        createdAt: daysAgo(75),
      });
      orders.push({
        amount: 4200,
        category: "Apparel",
        createdAt: daysAgo(90),
      });
      totalSpent = 12700;
    } else if (i % 8 === 3) {
      // Profile 4: Frequent buyer likely to convert (ordered 5 times in last 30 days)
      for (let j = 0; j < 5; j++) {
        orders.push({
          amount: 600 + j * 100,
          category: "Coffee",
          createdAt: daysAgo(2 + j * 5),
        });
      }
      totalSpent = 4000;
    } else if (i % 8 === 4) {
      // Profile 5: Inactive premium customer (spent > 15000, last order 100 days ago)
      orders.push({
        amount: 16000,
        category: "Apparel",
        createdAt: daysAgo(110),
      });
      totalSpent = 16000;
    } else {
      // General random customers
      const orderCount = 1 + (i % 4);
      for (let j = 0; j < orderCount; j++) {
        const category = [
          "Sneakers",
          "Apparel",
          "Beauty",
          "Accessories",
          "Coffee",
        ][(i + j) % 5];
        const amount = 500 + ((i * 123 + j * 50) % 4500);
        orders.push({
          amount,
          category,
          createdAt: daysAgo(5 + j * 20),
        });
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

  // Insert customers sequentially to avoid pooler transaction/concurrency limits
  let customerCount = 0;
  let orderCount = 0;

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
    customerCount++;
    orderCount += customer.orders.length;
  }

  console.log(
    `Successfully seeded database: ${customerCount} customers, ${orderCount} orders created.`,
  );
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
