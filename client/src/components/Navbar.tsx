import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="absolute w-full top-0 py-6 px-6 md:px-32 flex items-center justify-between bg-transparent z-50">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="QuickHire" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-[#25324B] tracking-tight">QuickHire</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-[#515B6F] font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Find Jobs</Link>
          <Link href="#" className="hover:text-primary transition-colors">Browse Companies</Link>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Link href="#" className="text-primary font-bold hover:opacity-80">Login</Link>
        <div className="w-[1px] h-6 bg-border hidden md:block"></div>
        <Link href="#" className="bg-primary text-white font-bold px-7 py-3 rounded-none transition-all hover:opacity-90">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
