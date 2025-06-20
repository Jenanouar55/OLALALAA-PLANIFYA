import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const canvasRef = useRef(null);
  const headingRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = [];
    const STAR_COUNT = 300;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random(),
        flicker: Math.random() * 0.05 + 0.01,
        color: `hsla(${Math.random() * 360}, 100%, 85%, 0.8)`
      });
    }

    function animate() {
      ctx.fillStyle = "#0c1a2b"; //"#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x += star.dx;
        star.y += star.dy;

        if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.dy *= -1;

        star.opacity += star.flicker;
        if (star.opacity >= 1 || star.opacity <= 0.3) star.flicker *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace("0.8", star.opacity.toFixed(2));
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (headingRef.current) {
        setButtonWidth(headingRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", resizeHandler);

    if (headingRef.current) {
      setButtonWidth(headingRef.current.offsetWidth);
    }

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="relative w-full h-screen text-white overflow-hidden bg-[#0c1a2b]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
      ></canvas>

      <main className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
        >
          <span className="text-[#A1C4FD]">Planifiez.</span>{" "}
          <span className="text-[#5C6AC4]">Créez.</span>{" "}
          <span className="text-[#7B61FF]">Brillez.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-gray-300 text-base sm:text-lg max-w-xl mb-8 font-bold"
          style={{ fontFamily: "'Changa', sans-serif" }}
        >
          Le calendrier intelligent pour les créateurs et agences : idées,
          légendes et jours clés, tout en un seul endroit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <Link
            to="/signup"
            style={{ width: `${buttonWidth}px` }}
            className="inline-block bg-[#1f285e] hover:bg-[#2c3e80] text-white font-medium py-3 px-8 rounded-xl transition duration-300 shadow-lg text-center"
          >
            Commencer maintenant
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default HeroSection;
