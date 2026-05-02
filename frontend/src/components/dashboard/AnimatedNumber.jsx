import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const AnimatedNumber = ({ value, duration = 2000, prefix = "", suffix = "", decimalPlaces = 0 }) => {
  const [inView, setInView] = useState(false);
  const springValue = useSpring(0, {
    bounce: 0,
    duration: duration,
  });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return prefix + current.toFixed(decimalPlaces) + suffix;
  });

  return (
    <motion.span
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, margin: "-50px" }}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedNumber;
