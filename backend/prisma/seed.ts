import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const catalog = [
  {
    name: "PVC Pipes",
    slug: "pvc-pipes",
    products: [
      "Gray Color PVC Pipe SCH 80,ASTM D1785 Schedule 80 PVC 1120 Standard",
      "UPVC ASTM D 1785 SCH40 Schedule 40 PVC Pipes For Water Supply",
      "JIS PVC Pipe VP",
      "ASTM F441 Schedule 80 CPVC Pipes,SCH80 Standard For Hot Water Supply",
      "DIN 8062 Standard PVC For Water Supply Pipe,Plastic Tube",
      "CPVC Pipe SCH40,Schedule40 For Hot Water Supply",
      "DIN EN ISO 15493 Industry Application,CPVC Hot Water Plastic Pipe",
      "DIN EN ISO 15877 CPVC Pipe For Hot Water",
      "DIN 8061 Standard Plastic PVC Pipe For Cold And Hot Water Supply",
    ],
  },
  {
    name: "PVC Fittings (SCH40, SCH80)",
    slug: "pvc-fittings",
    products: [
      "JIS PVC Coupling Socket TS",
      "Convenient SCH 80 PVC Union ,2 Inch ,4 Inch Pipe Fitting",
      "SCH 80 CPVC Vanstone Loose Flange",
      "CPVC Copper Brass Threaded Blind Flange",
      "PVC Elbow 90 Deg With Rubber Ring Joint RR FF , Flexible Joint Using For Irrigation",
      "Industry Type PVC 90 Deg Elbow PN16",
      "PVC Copper With Threaded Cap PN10",
      "EPDM Flange Gasket JIS 10K",
      "Special Fitting PVC Y Tee",
      "UPVC SCH80 Blind Flange,TS Flange",
      "SCH 80 CPVC One Piece Plastic Flange",
      "CPVC Vanstone Flange ,Can Call S.W Or Loose Type",
      "PVC One Piece Flange PN16 Plastic Fitting",
      "PVC Tee With Copper Threaded Fitting PN10",
      "JIS PVC Blind Flange TS",
    ],
  },
  {
    name: "Valves",
    slug: "valves",
    products: [
      "PVC Flanged Diaphragm Valve JIN/DIN/ASTM",
      "PVC True Union Diaphragm Valve JIN/DIN/ASTM Standard",
      "PVC Socket Diaphgram Valve JIN/DIN/ASTM Standard",
      "CPVC Flanged Diaphragm Valve Can Supply EPDM And FPM Material",
      "CPVC True Union Diaphragm Valve Pressure 1.0Mpa",
      "CPVC Socket Diaphgram Valve JIN/DIN/ASTM",
      "CPVC Swinging Bottom Valve Light Grey Color",
      "CPVC Swing Check Valve DIN Standard Grey Color",
      "PVC General Handle Butterfly Valve DIN ASTM JIS Standard",
      "PVC Socket True Union Ball Valve For Water Supply",
      "CPVC Single Union Bottom Valve DIN Standard",
      "CPVC Single Union Check Valve 1.0Mpa DIN Standard",
      "PVC Eccentric Butterfly Valve 1.0Mpa Wafer Type GF Flange Connection",
      "PVC Threaded Ball Valve DIN Standard BSPT Thread",
    ],
  },
] as const;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

async function main() {
  for (const category of catalog) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { name: category.name, slug: category.slug },
    });

    const cat = await prisma.category.findUniqueOrThrow({
      where: { slug: category.slug },
    });

    for (const name of category.products) {
      const productSlug = slugify(name);
      await prisma.product.upsert({
        where: { slug: productSlug },
        update: {
          name,
          description: `${name}. Super flow industrial catalog product.`,
          image: null,
          categoryId: cat.id,
        },
        create: {
          name,
          slug: productSlug,
          description: `${name}. Super flow industrial catalog product.`,
          image: null,
          categoryId: cat.id,
          specs: {
            create: [
              { key: "Brand", value: "Super flow" },
              { key: "Material", value: "PVC/CPVC" },
              { key: "Standard", value: "ASTM / DIN / JIS" },
            ],
          },
          tables: {
            create: [{ size: "Refer to product data", diameter: "-", thickness: "-" }],
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
