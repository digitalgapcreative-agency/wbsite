import React from "react";
import { Link } from "react-router-dom";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "framer-motion";

export const HeroParallax = ({ products, header }) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);

    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );

    return (
        <div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
            style={{ background: "linear-gradient(180deg, #250601 0%, #1a0401 25%, #2d0502 45%, #8a4a2a 65%, #c8a882 80%, #efe8dc 100%)" }}
        >
            {header}
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                {/* Row 1 – moves right */}
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>

                {/* Row 2 – moves left */}
                <motion.div className="flex flex-row mb-20 space-x-20">
                    {secondRow.map((product) => (
                        <ProductCard product={product} translate={translateXReverse} key={product.title} />
                    ))}
                </motion.div>

                {/* Row 3 – moves right */}
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

const ProductCard = ({ product, translate }) => {
    return (
        <motion.div
            style={{ x: translate }}
            whileHover={{ y: -20 }}
            key={product.title}
            className="group/product h-96 w-[30rem] relative flex-shrink-0"
        >
            <Link to={product.link} className="block group-hover/product:shadow-2xl">
                <img
                    src={product.thumbnail}
                    height={600}
                    width={600}
                    className="object-cover object-center absolute h-full w-full inset-0 rounded-none"
                    alt={product.title}
                    loading="lazy"
                />
            </Link>
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-[#250601] pointer-events-none transition-opacity duration-300" />
            <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-[#FDFDFD] font-semibold transition-opacity duration-300 font-sans text-base tracking-wide">
                {product.title}
            </h2>
        </motion.div>
    );
};

export default HeroParallax;
