"use server"
import { db } from "@/server/db"
import type { Units } from "@prisma/client"

const ingredeintser = [
  {
    name: "köttfärs",
    unit: "kg",
    amount: 1,
  },
  {
    name: "worcesersås",
    unit: "msk",
    amount: 2,
  },
  {
    name: "zuccini",
    unit: "st",
    amount: 1,
  },
  {
    name: "lök",
    unit: "st",
    amount: 2,
  },
  {
    name: "krossade tomater",
    unit: "g",
    amount: 400,
  },
  {
    name: "tomatpuré",
    unit: "msk",
    amount: 2,
  },
  {
    name: "buljongtärning",
    unit: "st",
    amount: 1,
  },
  {
    name: "oregano",
    unit: "msk",
    amount: 1,
  },
  {
    name: "basilika",
    unit: "msk",
    amount: 1,
  },
  {
    name: "sambal oelek",
    unit: "msk",
    amount: 1,
  },
  {
    name: "smör",
    unit: "g",
    amount: 100,
  },
  {
    name: "mjöl",
    unit: "msk",
    amount: 4,
  },
  {
    name: "mjölk",
    unit: "dl",
    amount: 10,
  },
  {
    name: "parmesan",
    unit: "dl",
    amount: 2,
  },
  {
    name: "peppar",
    unit: "krm",
    amount: 2,
  },
  {
    name: "lasagneplattor",
    unit: "pkt",
    amount: 1,
  },
]
export default async function generateExampleData() {
  console.log("Generating")
  await db.user.create({
    data: {
      name: "Vilhelm",
      recipesCreated: {
        create: {
          title: "Eriks Speciallassagne",
          description:
            "Riktigt god lassagne efter hur min kamrat Erik brukar göra den. Krydning även tagen från ett ICA recept ger en otrolig kombo! Tar ett tag att göra, men det blir ack så gott. Fungerar även otroligt bra i matlåda eller att frysa in.",
          instructions: [
            "Riv zuccini och hacka löken. Fräs någon minut i olja och smör.",
            "Tillsätt köttfärsen och stek yterliager någon minut.",
            "Tillsätt krossade tomater, tomatpuré, vatten, buljongtärning, oregano, basilika, sambal oelek, och worcestersås",
            "Låt koka under tiden du gör bechamelsåsen, minst 20 minuter",
            "Riv osten",
            "Smält smöret i en kastrull, tillsätt mjölet och rör om",
            "Tillsätt mjölken under kraftig omrörning. Låt långsamt koka upp, även det under omrörning",
            "Låt koka i 5 minuter, och tillsätt sedan ost och peppar",
            "Bilda lager av köttfärs, bechamelsås och lasagneplattor i denna ordning i en ungsform. Avsluta med såsen högst upp",
            "Grädda i ugnen på 200 grader enligt avisering på lassagneplattorna",
          ],
          public: true,
          ingredients: {
            create: ingredeintser.map((ing) => ({
              amount: ing.amount,
              unit: ing.unit as Units,
              ingredient: {
                connectOrCreate: {
                  where: {
                    name: ing.name,
                  },
                  create: {
                    name: ing.name,
                    defaultUnit: ing.unit as Units,
                  },
                },
              },
            })),
          },
        },
      },
    },
  })
}
