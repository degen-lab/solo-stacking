"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="-mt-[200px] flex justify-center items-center text-center px-4 bg-neutral-800 dark:bg-white text-white dark:text-black p-4">
      <p className="text-medium font-mono mr-2 ">Powered by</p>
      <a href="https://degenlab.io/" target="_blank" rel="noopener noreferrer">
        <Image
          src="/degenlab.png"
          alt="Powered by DegenLab"
          width={60}
          height={60}
          className="invert dark:invert-0" // Adjust the image inversion based on the theme
        />
      </a>
    </footer>
  );
};

export default Footer;
