import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t z-10 ">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2024 College Papers. All rights reserved.
      </p>
      <nav className="sm:ml-auto text-xs flex gap-2">
        Developed By
        <a
          className="underline underline-offset-4"
          href="https://akxyakumar.vercel.app"
        >
          akxayakumar
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
