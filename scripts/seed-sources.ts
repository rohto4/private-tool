import { prisma } from "@/lib/db/client";
import { initialSources } from "@/lib/sources/initial-sources";

async function main() {
  for (const source of initialSources) {
    await prisma.sourceTarget.upsert({
      where: { sourceKey: source.sourceKey },
      create: source,
      update: source
    });
  }

  console.log(`Seeded ${initialSources.length} source targets.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
