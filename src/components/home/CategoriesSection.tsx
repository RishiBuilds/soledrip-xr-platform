import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Men",
    href: "/shop?category=men",
    image: "🏃",
    description: "Performance & Style",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    name: "Women",
    href: "/shop?category=women",
    image: "👟",
    description: "Elegance in Motion",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    name: "Sports",
    href: "/shop?category=sports",
    image: "⚡",
    description: "Built for Athletes",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Sneakers",
    href: "/shop?category=sneakers",
    image: "🔥",
    description: "Street Culture Icons",
    color: "from-orange-500/20 to-red-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function CategoriesSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Browse Collections
          </span>
          <h2 className="mt-3 font-display text-5xl tracking-tight lg:text-6xl">
            SHOP BY CATEGORY
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Find the perfect pair for every occasion
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link
                to={category.href}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="relative aspect-[0.75] overflow-hidden">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-linear-to-br ${category.color} transition-transform duration-700 group-hover:scale-110`} />
                  
                  {/* Pattern overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  
                  {/* Emoji placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-[120px] opacity-40 transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.image}
                    </motion.span>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-90" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-3xl tracking-wide">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                      <span className="relative">
                        Shop Now
                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}