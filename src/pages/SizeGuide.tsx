import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Ruler, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const menSizes = [
  { us: "6", uk: "5.5", eu: "38.5", cm: "24" },
  { us: "6.5", uk: "6", eu: "39", cm: "24.5" },
  { us: "7", uk: "6.5", eu: "40", cm: "25" },
  { us: "7.5", uk: "7", eu: "40.5", cm: "25.5" },
  { us: "8", uk: "7.5", eu: "41", cm: "26" },
  { us: "8.5", uk: "8", eu: "42", cm: "26.5" },
  { us: "9", uk: "8.5", eu: "42.5", cm: "27" },
  { us: "9.5", uk: "9", eu: "43", cm: "27.5" },
  { us: "10", uk: "9.5", eu: "44", cm: "28" },
  { us: "10.5", uk: "10", eu: "44.5", cm: "28.5" },
  { us: "11", uk: "10.5", eu: "45", cm: "29" },
  { us: "12", uk: "11.5", eu: "46", cm: "30" },
  { us: "13", uk: "12.5", eu: "47.5", cm: "31" },
];

const womenSizes = [
  { us: "5", uk: "2.5", eu: "35.5", cm: "22" },
  { us: "5.5", uk: "3", eu: "36", cm: "22.5" },
  { us: "6", uk: "3.5", eu: "36.5", cm: "23" },
  { us: "6.5", uk: "4", eu: "37.5", cm: "23.5" },
  { us: "7", uk: "4.5", eu: "38", cm: "24" },
  { us: "7.5", uk: "5", eu: "38.5", cm: "24.5" },
  { us: "8", uk: "5.5", eu: "39", cm: "25" },
  { us: "8.5", uk: "6", eu: "40", cm: "25.5" },
  { us: "9", uk: "6.5", eu: "40.5", cm: "26" },
  { us: "9.5", uk: "7", eu: "41", cm: "26.5" },
  { us: "10", uk: "7.5", eu: "42", cm: "27" },
  { us: "11", uk: "8.5", eu: "43", cm: "28" },
];

export default function SizeGuidePage() {
  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">
            Size <span className="text-primary">Guide</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find your perfect fit with our comprehensive size charts.
          </p>

          {/* How to Measure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-12 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <Ruler className="h-6 w-6 text-primary" />
              <h2 className="font-display text-xl tracking-wide">How to Measure Your Feet</h2>
            </div>
            <ol className="mt-4 space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                Place a piece of paper on a hard floor against a wall.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                Stand on the paper with your heel against the wall.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                Mark the tip of your longest toe on the paper.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                Measure the distance from the wall to the mark in centimeters.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                Use the chart below to find your size. Measure both feet and use the larger measurement.
              </li>
            </ol>
          </motion.div>

          {/* Size Charts */}
          <div className="mt-12">
            <Tabs defaultValue="men" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="men">Men's Sizes</TabsTrigger>
                <TabsTrigger value="women">Women's Sizes</TabsTrigger>
              </TabsList>
              <TabsContent value="men" className="mt-6">
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-muted">US</TableHead>
                        <TableHead className="bg-muted">UK</TableHead>
                        <TableHead className="bg-muted">EU</TableHead>
                        <TableHead className="bg-muted">CM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menSizes.map((size) => (
                        <TableRow key={size.us}>
                          <TableCell className="font-medium">{size.us}</TableCell>
                          <TableCell>{size.uk}</TableCell>
                          <TableCell>{size.eu}</TableCell>
                          <TableCell>{size.cm}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="women" className="mt-6">
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-muted">US</TableHead>
                        <TableHead className="bg-muted">UK</TableHead>
                        <TableHead className="bg-muted">EU</TableHead>
                        <TableHead className="bg-muted">CM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {womenSizes.map((size) => (
                        <TableRow key={size.us}>
                          <TableCell className="font-medium">{size.us}</TableCell>
                          <TableCell>{size.uk}</TableCell>
                          <TableCell>{size.eu}</TableCell>
                          <TableCell>{size.cm}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6"
          >
            <div className="flex items-center gap-3">
              <Info className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Sizing Tips</h3>
            </div>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>• Measure your feet at the end of the day when they're at their largest.</li>
              <li>• If you're between sizes, we recommend going up a half size.</li>
              <li>• Sizing may vary slightly between brands - check product descriptions for specific guidance.</li>
              <li>• For wide feet, consider sizing up or looking for wide-fit options.</li>
              <li>• Athletic shoes often run slightly smaller - consider sizing up for these.</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <div className="mt-8 text-center text-muted-foreground">
            <p>
              Still unsure about your size?{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact our support team
              </a>{" "}
              and we'll help you find the perfect fit.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
